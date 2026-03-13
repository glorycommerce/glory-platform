import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3";
import { env } from "@/lib/env";

export async function POST() {
  if (!s3 || !env.MINIO_BUCKET) {
    return NextResponse.json(
      { status: "error", message: "MinIO is not configured." },
      { status: 400 }
    );
  }

  const key = `uploads/${Date.now()}-placeholder.png`;
  const command = new PutObjectCommand({
    Bucket: env.MINIO_BUCKET,
    Key: key,
    ContentType: "image/png",
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
  return NextResponse.json({ status: "ok", url, key });
}
