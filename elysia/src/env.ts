// 환경 변수 로더 및 스키마 검증
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.string().default("3000"),
  JWT_SECRET_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  S3_QR_BUCKET: z.string(),
  S3_PROFILE_BUCKET: z.string(),
  URL_SIGNER_SECRET_KEY: z.string(),
  URL_SIGNER_ALGORITHM: z.string(),
  DYNAMODB_TABLE_PREFIX: z.string().default("moeasy"),
});

export type Env = z.infer<typeof EnvSchema>;

export const loadEnv = (): Env => {
  // dotenv는 Bun에서 자동 로드되지 않으므로 명시적 로드
  // bun test / run 환경 모두에서 안정적으로 동작
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("dotenv").config();
  } catch {
    // ignore
  }

  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // 상세 에러 메시지 제공
    const msg = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join(", ");
    throw new Error(`Invalid environment variables: ${msg}`);
  }
  return parsed.data;
};

