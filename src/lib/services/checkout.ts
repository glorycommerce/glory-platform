import { db } from "@/lib/db";
import { getCatalogProductBySlug } from "@/lib/services/catalog";
import { buildCartQuote } from "@/lib/services/pricing";

type CheckoutItemInput = {
  productSlug: string;
  variantId: string;
  quantity: number;
};

type CheckoutInput = {
  merchantSlug: string;
  items: CheckoutItemInput[];
  paymentMethod: "SSLCOMMERZ" | "COD" | "ADVANCE" | "EMI" | "STRIPE";
  couponCode?: string;
  requestedPoints?: number;
  userId?: string;
};

async function getCoupon(merchantId: string, code?: string) {
  if (!code) {
    return null;
  }
  const now = new Date();
  return db.coupon.findFirst({
    where: {
      code,
      status: "ACTIVE",
      merchantId,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
    },
  });
}

async function getUserPointsBalance(userId?: string) {
  if (!userId) {
    return 0;
  }
  const ledger = await db.pointsLedger.findMany({
    where: { userId },
    select: { points: true },
  });
  return ledger.reduce((sum: number, item: { points: number }) => sum + item.points, 0);
}

export async function createOrderWithQuote(input: CheckoutInput) {
  const merchant = await db.merchant.findUnique({
    where: { slug: input.merchantSlug },
    select: { id: true },
  });

  if (!merchant) {
    throw new Error("Merchant not found");
  }

  const products = await Promise.all(
    input.items.map((item) => getCatalogProductBySlug(item.productSlug, input.merchantSlug))
  );

  const missing = products.find((item) => !item);
  if (missing) {
    throw new Error("One or more products not found");
  }

  const coupon = await getCoupon(merchant.id, input.couponCode);
  const pointsBalance = await getUserPointsBalance(input.userId);

  const quote = buildCartQuote({
    lines: input.items.map((item, index) => ({
      product: products[index]!,
      variantId: item.variantId,
      quantity: item.quantity,
    })),
    coupon,
    pointsBalance,
    maxPointsPerOrder: 500,
    requestedPoints: input.requestedPoints ?? 0,
  });

  for (const line of quote.lines) {
    const variant = products
      .flatMap((item) => item!.variants)
      .find((item) => item.id === line.variantId);
    if (!variant || variant.stock < line.quantity) {
      throw new Error("Stock is not available for one or more variants");
    }
  }

  const order = await db.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        merchantId: merchant.id,
        userId: input.userId,
        total: quote.grandTotal,
        paymentMethod: input.paymentMethod,
        paymentStatus: "PENDING",
        couponId: coupon?.id,
        items: {
          create: quote.lines.map((line) => ({
            variantId: line.variantId,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
          })),
        },
        payments: {
          create: {
            method: input.paymentMethod,
            status: "PENDING",
            amount: quote.grandTotal,
          },
        },
      },
      include: { items: true },
    });

    for (const line of quote.lines) {
      await tx.variant.update({
        where: { id: line.variantId },
        data: {
          stock: { decrement: line.quantity },
          inventory: {
            create: {
              movement: "DECREASE",
              quantity: line.quantity,
              note: `Order ${created.id}`,
            },
          },
        },
      });
    }

    if (quote.pointsRedeemed > 0 && input.userId) {
      await tx.pointsLedger.create({
        data: {
          userId: input.userId,
          points: -quote.pointsRedeemed,
          reason: `Redeemed on order ${created.id}`,
        },
      });
    }

    if (input.userId) {
      const earned = Math.floor(quote.grandTotal * 0.02);
      if (earned > 0) {
        await tx.pointsLedger.create({
          data: {
            userId: input.userId,
            points: earned,
            reason: `Earned from order ${created.id}`,
          },
        });
      }
    }

    return created;
  });

  return {
    orderId: order.id,
    total: quote.grandTotal,
    quote,
  };
}
