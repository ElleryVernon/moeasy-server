// JWT 유틸 및 Elysia 플러그인
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import { SignJWT, jwtVerify } from "jose";
import type { Env } from "./env";

const encoder = new TextEncoder();

export const createJwtUtil = (env: Env) => {
  const secret = encoder.encode(env.JWT_SECRET_KEY);

  const generateAccessToken = async (email: string) => {
    // 2시간 만료
    const expSeconds = Math.floor(Date.now() / 1000) + 60 * 60 * 2;
    const token = await new SignJWT({})
      .setSubject(email)
      .setIssuedAt()
      .setExpirationTime(expSeconds)
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);
    return token;
  };

  const generateRefreshToken = async (email: string) => {
    // 7일 만료
    const expSeconds = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
    const token = await new SignJWT({})
      .setSubject(email)
      .setIssuedAt()
      .setExpirationTime(expSeconds)
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);
    return token;
  };

  const extractEmail = async (token: string): Promise<string> => {
    const { payload } = await jwtVerify(token, secret);
    const sub = payload.sub;
    if (!sub) throw new Error("invalid token");
    return sub;
  };

  const validateToken = async (token: string, email: string) => {
    const e = await extractEmail(token);
    return e === email;
  };

  return {
    generateAccessToken,
    generateRefreshToken,
    extractEmail,
    validateToken,
  };
};

