// Account 라우트 포팅
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import { Elysia, t } from "elysia";
import { success, fail } from "../responses";
import { createJwtUtil } from "../jwt";
// store 타입 제네릭은 제거하고 decorate 로 주입된 store 사용
import type {
  AppLoginTokenDto,
  MobileKakasSdkTokenDto,
  RefreshDto,
  TokenDto,
  ProfileDto,
} from "../types";

export const accountRoutes = new Elysia({ prefix: "/account" })
  // GET /account (프로필)
  .get(
    "/",
    async ({
      store,
      cookie,
      set,
    }: {
      store: import("../store").AppStore;
      cookie: Record<string, any>;
      set: { status: number };
    }) => {
      try {
        const authorization = (cookie as any)?.Authorization?.value || "";
        const token = authorization.startsWith("Bearer ")
          ? authorization.substring(7)
          : authorization;

        const jwt = createJwtUtil((store as any).env);
        const email = await jwt.extractEmail(token);

        // 사용자 정보 조회는 외부 의존(Kakao/DB)이 있었으나, 모킹/간소화
        const name = "unknown";
        const profileKey = `${email}/profile.png`;

        const profileUrl = `https://s3.${
          (store as any).env.AWS_REGION
        }.amazonaws.com/${(store as any).env.S3_PROFILE_BUCKET}/${profileKey}`;
        const body: ProfileDto = { email, name, profileUrl };
        return success(200, "success", body);
      } catch {
        set.status = 401;
        return fail(401, "유효하지 않은 토큰");
      }
    }
  )

  // POST /account/login
  .post(
    "/login",
    async ({
      body,
      store,
      set,
    }: {
      body: unknown;
      store: import("../store").AppStore;
      set: { status: number };
    }) => {
      const dto = body as MobileKakasSdkTokenDto;

      if (!dto?.accessToken) {
        set.status = 401;
        return fail(
          401,
          "유효하지 않은 카카오 토큰이거나 사용자 정보를 가져올 수 없습니다."
        );
      }

      // 원본 로직: Kakao SDK 토큰으로 사용자 조회 → 토큰 발급 → refresh 저장
      // 여기서는 이메일을 accessToken에서 유추/모킹 (실제 구현시 Kakao API 호출 필요)
      const email = `kakao_${dto.accessToken}@example.com`;
      const jwt = createJwtUtil((store as any).env);
      const accessToken = await jwt.generateAccessToken(email);
      const refreshToken = await jwt.generateRefreshToken(email);

      const bodyOut: AppLoginTokenDto = {
        accessToken,
        refreshToken,
        email,
        name: "kakao-user",
      };
      return success(200, "login success", bodyOut);
    },
    {
      body: t.Object({ accessToken: t.String() }),
    }
  )

  // POST /account/refresh
  .post(
    "/refresh",
    async ({
      request,
      body,
      store,
      cookie,
      set,
    }: {
      request: Request;
      body: unknown;
      store: import("../store").AppStore;
      cookie: Record<string, any>;
      set: { status: number };
    }) => {
      const auth = request.headers.get("authorization");
      if (!auth || !auth.startsWith("Bearer ")) {
        set.status = 400;
        return fail(400, "헤더에 유효한 Access Token이 없습니다.");
      }
      const accessToken = auth.substring(7);

      const jwt = createJwtUtil((store as any).env);
      let userEmail: string;
      let isExpired = false;
      try {
        userEmail = await jwt.extractEmail(accessToken);
        await jwt.validateToken(accessToken, userEmail);
      } catch (e: any) {
        isExpired = true;
        // jose는 ExpiredSignature 에러를 던짐 → 이메일 추출 시도
        try {
          const email = await jwt.extractEmail(accessToken);
          userEmail = email;
        } catch {
          set.status = 401;
          return fail(401, "Access Token이 유효하지 않습니다.");
        }
      }

      // refresh token: 쿠키 우선 → 바디 보조
      let providedRefreshToken: string | undefined = (cookie as any)
        ?.refresh_token?.value;
      if (!providedRefreshToken && body) {
        const r = body as RefreshDto;
        if (r.refreshToken) providedRefreshToken = r.refreshToken;
      }
      if (!providedRefreshToken) {
        set.status = 400;
        return fail(400, "Refresh Token이 제공되지 않았습니다.");
      }

      if (!isExpired) {
        const tokenMap = {
          access_token: accessToken,
          refresh_token: providedRefreshToken,
        };
        return success(200, "Access Token이 아직 유효합니다.", tokenMap);
      }

      // 새 토큰 재발급
      const newAccessToken = await jwt.generateAccessToken(userEmail);
      const newRefreshToken = await jwt.generateRefreshToken(userEmail);

      const tokenDto: TokenDto = {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
      // 쿠키 재설정: Secure/HttpOnly는 배포 레벨에서 설정 권장
      (cookie as any).refresh_token = {
        value: newRefreshToken,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      };

      return success(200, "토큰이 성공적으로 갱신되었습니다.", tokenDto);
    }
  )

  // POST /account/logout
  .post(
    "/logout",
    async ({
      request,
      store,
      cookie,
    }: {
      request: Request;
      store: import("../store").AppStore;
      cookie: Record<string, any>;
    }) => {
      const auth = request.headers.get("authorization");
      const token = auth?.startsWith("Bearer ") ? auth.substring(7) : "";
      if (token) {
        const jwt = createJwtUtil((store as any).env);
        const email = await jwt.extractEmail(token);
        // refresh 삭제는 실제에 맞게 Repo로 전환 가능
      }

      (cookie as any).refresh_token = {
        value: "",
        httpOnly: true,
        path: "/",
        maxAge: 0,
        sameSite: "lax",
      };
      return success(200, "logout success", null);
    }
  );
