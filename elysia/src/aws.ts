// AWS S3 / DynamoDB 클라이언트 팩토리
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import type { Env } from "./env";

export const createAwsClients = (env: Env) => {
  const s3 = new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const ddb = new DynamoDBClient({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const doc = DynamoDBDocumentClient.from(ddb, {
    marshallOptions: {
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    },
  });

  return { s3, ddb, doc };
};

export type AwsClients = ReturnType<typeof createAwsClients>;

export const uploadPngToS3 = async (
  s3: S3Client,
  bucket: string,
  key: string,
  buffer: Uint8Array
) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: "image/png",
    })
  );
};

export const createPresignedGetUrl = async (
  s3: S3Client,
  bucket: string,
  key: string,
  expiresInSeconds = 3600
) => {
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3, cmd, { expiresIn: expiresInSeconds });
};
