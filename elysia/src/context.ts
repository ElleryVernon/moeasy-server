// 앱 컨텍스트 타입 확장
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import type { Env } from "./env";
import type { S3Client } from "@aws-sdk/client-s3";
import type { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import type { Repo } from "./repo";

export type AppContext = {
  env: Env;
  aws: { s3: S3Client; ddb: DynamoDBClient; doc: DynamoDBDocumentClient };
  repo: Repo;
};

