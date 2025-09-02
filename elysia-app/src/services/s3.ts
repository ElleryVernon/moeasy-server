import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { config } from '../config/env'

const s3 = new S3Client({ region: config.aws.region })

export const uploadToS3 = async (key: string, body: Buffer | Uint8Array | string, contentType?: string) => {
  await s3.send(new PutObjectCommand({ Bucket: config.aws.bucket, Key: key, Body: body, ContentType: contentType }))
  return { key, url: `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${encodeURIComponent(key)}` }
}

export const getFromS3 = async (key: string) => s3.send(new GetObjectCommand({ Bucket: config.aws.bucket, Key: key }))
