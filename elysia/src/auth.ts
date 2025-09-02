// 인증/인가 플러그인: Spring SecurityConfig 와 동일한 permitAll 경로 적용
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import { Elysia } from "elysia";
import { createJwtUtil } from "./jwt";
import { fail } from "./responses";
import type { Env } from "./env";

const permitAll = new Set<string>([
  "/survey", // GET/POST 허용
  "/account/login",
  "/questions/verifyQrCode",
  "/account/callback",
  "/healthcheck",
  "/fail",
  "/error",
  // swagger 경로는 생략
]);

const isPermitAll = (path: string) => {
  if (path === "/survey") return true; // GET/POST 모두 허용
  return permitAll.has(path);
};

export const createAuthPlugin = (env: Env) =>
  new Elysia()
    .derive(async ({ request }) => {
      const auth = request.headers.get("authorization");
      const token =
        auth && auth.startsWith("Bearer ") ? auth.substring(7) : undefined;
      if (token) {
        try {
          const jwt = createJwtUtil(env);
          const email = await jwt.extractEmail(token);
          return { userEmail: email as string | undefined };
        } catch {
          return { userEmail: undefined as string | undefined };
        }
      }
      return { userEmail: undefined as string | undefined };
    })
    .onBeforeHandle(({ path, userEmail, set }) => {
      if (isPermitAll(path)) return;
      if (!userEmail) {
        set.status = 401;
        return fail(401, "유효하지 않은 토큰");
      }
    });
