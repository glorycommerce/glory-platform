import { NextResponse } from "next/server";
import { z } from "zod";
import { generateTryOnImage } from "@/lib/ai";
import { getCatalogProductBySlug } from "@/lib/services/catalog";

const payloadSchema = z.object({
  productSlug: z.string().min(1),
  variantId: z.string().min(1),
});

async function externalImageToBase64(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Selected garment image could not be downloaded.");
  }

  const arrayBuffer = await response.arrayBuffer();
  return {
    mimeType: response.headers.get("content-type") || "image/jpeg",
    data: Buffer.from(arrayBuffer).toString("base64"),
  };
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const payload = payloadSchema.parse({
      productSlug: formData.get("productSlug"),
      variantId: formData.get("variantId"),
    });

    if (!(file instanceof File)) {
      return NextResponse.json(
        { status: "error", message: "Upload a valid image file first." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { status: "error", message: "Only image uploads are supported." },
        { status: 400 }
      );
    }

    const product = await getCatalogProductBySlug(payload.productSlug, "glory");

    if (!product) {
      return NextResponse.json(
        { status: "error", message: "Selected product was not found." },
        { status: 404 }
      );
    }

    const variant = product.variants.find((item) => item.id === payload.variantId);

    if (!variant) {
      return NextResponse.json(
        { status: "error", message: "Selected variant was not found." },
        { status: 404 }
      );
    }

    const garmentImage = variant.images[0];
    if (!garmentImage) {
      return NextResponse.json(
        { status: "error", message: "Selected product does not have a usable image." },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const [personImage, garmentInline] = await Promise.all([
      Promise.resolve({
        mimeType: file.type || "image/jpeg",
        data: fileBuffer.toString("base64"),
      }),
      externalImageToBase64(garmentImage),
    ]);

    const variantLabel = [variant.color, variant.size, variant.stitching]
      .filter(Boolean)
      .join(" • ");

    const generated = await generateTryOnImage({
      personImage,
      garmentImage: garmentInline,
      productName: product.name,
      productDescription: product.description,
      variantLabel: variantLabel || variant.sku,
    });

    return NextResponse.json({
      status: "ok",
      message: generated.message,
      resultImageUrl: `data:${generated.image.mimeType};base64,${generated.image.data}`,
      inputImageUrl: `data:${personImage.mimeType};base64,${personImage.data}`,
      product: {
        slug: product.slug,
        name: product.name,
      },
      variant: {
        id: variant.id,
        sku: variant.sku,
        color: variant.color,
        size: variant.size,
        stitching: variant.stitching,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: (error as Error).message },
      { status: 400 }
    );
  }
}
