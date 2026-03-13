import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env";

export const s3 =
  env.MINIO_ENDPOINT && env.MINIO_ACCESS_KEY && env.MINIO_SECRET_KEY
    ? new S3Client({
        region: env.MINIO_REGION ?? "us-east-1",
        endpoint: env.MINIO_ENDPOINT,
        credentials: {
          accessKeyId: env.MINIO_ACCESS_KEY,
          secretAccessKey: env.MINIO_SECRET_KEY,
        },
        forcePathStyle: true,
      })
    : null;

export async function getPresignedUploadUrl(key: string, contentType: string) {
  if (!s3 || !env.MINIO_BUCKET) {
    throw new Error("MinIO is not configured.");
  }

  const command = new PutObjectCommand({
    Bucket: env.MINIO_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3, command, { expiresIn: 60 * 5 });
}

export async function getPresignedReadUrl(key: string) {
  if (!s3 || !env.MINIO_BUCKET) {
    throw new Error("MinIO is not configured.");
  }

  const command = new GetObjectCommand({
    Bucket: env.MINIO_BUCKET,
    Key: key,
  });

  return getSignedUrl(s3, command, { expiresIn: 60 * 10 });
}
