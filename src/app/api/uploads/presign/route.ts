import { NextResponse } from "next/server";
import { z } from "zod";
import { getPresignedUploadUrl } from "@/lib/s3";
import { env } from "@/lib/env";

const payloadSchema = z.object({
  fileName: z.string().min(1).max(200).optional(),
  contentType: z.string().min(1).max(100).default("image/png"),
});

function sanitizeFileName(fileName?: string) {
  const safeName = (fileName ?? "upload.png").replace(/[^a-zA-Z0-9._-]/g, "-");
  return safeName.length > 0 ? safeName : "upload.png";
}

export async function POST(req: Request) {
  if (!env.MINIO_BUCKET) {
    return NextResponse.json(
      { status: "error", message: "MinIO is not configured." },
      { status: 400 }
    );
  }

  const payload = payloadSchema.parse(await req.json().catch(() => ({})));
  const key = `uploads/tryon-inputs/${Date.now()}-${sanitizeFileName(payload.fileName)}`;
  const url = await getPresignedUploadUrl(key, payload.contentType);

  return NextResponse.json({ status: "ok", url, key });
}
