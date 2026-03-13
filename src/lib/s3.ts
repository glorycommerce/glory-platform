import { S3Client } from "@aws-sdk/client-s3";
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
