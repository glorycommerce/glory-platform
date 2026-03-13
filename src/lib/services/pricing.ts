import type { CatalogProduct } from "@/lib/types";

type CouponLike = {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  usageLimit: number | null;
  usedCount: number;
};

export type QuoteLineInput = {
  product: CatalogProduct;
  variantId: string;
  quantity: number;
};

export type CartQuote = {
  subtotal: number;
  discountTotal: number;
  couponTotal: number;
  pointsRedeemed: number;
  grandTotal: number;
  lines: Array<{
    variantId: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
};

function applyProductDiscount(unitPrice: number, discountPercent: number | null) {
  if (!discountPercent) {
    return unitPrice;
  }
  const reduced = Math.floor(unitPrice * (1 - discountPercent / 100));
  return Math.max(reduced, 0);
}

function applyCoupon(total: number, coupon: CouponLike | null) {
  if (!coupon) {
    return 0;
  }
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return 0;
  }
  if (coupon.type === "PERCENT") {
    return Math.floor(total * (coupon.value / 100));
  }
  return Math.min(coupon.value, total);
}

export function buildCartQuote(input: {
  lines: QuoteLineInput[];
  coupon: CouponLike | null;
  pointsBalance: number;
  maxPointsPerOrder: number;
  requestedPoints: number;
}): CartQuote {
  const lines = input.lines.map((line) => {
    const variant = line.product.variants.find((item) => item.id === line.variantId);
    if (!variant) {
      throw new Error(`Variant not found: ${line.variantId}`);
    }
    const safeQty = Math.max(1, line.quantity);
    const base = applyProductDiscount(variant.price, line.product.activeDiscountPercent);
    return {
      variantId: variant.id,
      quantity: safeQty,
      unitPrice: base,
      lineTotal: base * safeQty,
    };
  });

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const withoutCoupon = subtotal;
  const couponTotal = applyCoupon(withoutCoupon, input.coupon);
  const afterCoupon = Math.max(withoutCoupon - couponTotal, 0);

  const cappedRequestedPoints = Math.min(input.requestedPoints, input.maxPointsPerOrder);
  const pointsRedeemed = Math.min(cappedRequestedPoints, input.pointsBalance, afterCoupon);
  const grandTotal = Math.max(afterCoupon - pointsRedeemed, 0);

  return {
    subtotal,
    discountTotal: 0,
    couponTotal,
    pointsRedeemed,
    grandTotal,
    lines,
  };
}
