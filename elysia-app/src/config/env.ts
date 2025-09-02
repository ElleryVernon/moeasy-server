import 'dotenv/config'

export type AppConfig = {
  port: number
  nodeEnv: string
  jwt: { secret: string; expiresIn: number }
  kakao: { clientId: string; clientSecret: string; redirectUri: string }
  aws: { region: string; bucket: string }
  milvus: { address: string; username?: string; password?: string }
  ncs: { apiKey?: string; endpoint?: string }
}

const required = (key: string, fallback?: string) => {
  const v = process.env[key] ?? fallback
  if (!v) throw new Error(`Missing required env: ${key}`)
  return v
}

export const config: AppConfig = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  jwt: {
    secret: required('JWT_SECRET', 'change-me'),
    expiresIn: Number(process.env.JWT_EXPIRES_IN ?? 3600)
  },
  kakao: {
    clientId: process.env.KAKAO_CLIENT_ID ?? '',
    clientSecret: process.env.KAKAO_CLIENT_SECRET ?? '',
    redirectUri: process.env.KAKAO_REDIRECT_URI ?? 'http://localhost:3000/auth/kakao/callback'
  },
  aws: {
    region: process.env.AWS_REGION ?? 'ap-northeast-2',
    bucket: process.env.S3_BUCKET ?? ''
  },
  milvus: {
    address: process.env.MILVUS_ADDRESS ?? 'localhost:19530',
    username: process.env.MILVUS_USERNAME,
    password: process.env.MILVUS_PASSWORD
  },
  ncs: {
    apiKey: process.env.NAVER_CLOUD_STUDIO_API_KEY,
    endpoint: process.env.NAVER_CLOUD_STUDIO_ENDPOINT
  }
}
