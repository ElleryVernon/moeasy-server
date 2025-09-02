// Elysia 서버 부트스트랩 및 전역 에러 핸들링
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import { Elysia, t } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { loadEnv } from "./env";
import { createAwsClients } from "./aws";
import { success, fail } from "./responses";
import { CustomFailError, toErrorApi } from "./errors";
import { healthRoutes } from "./routes/health";
import { accountRoutes } from "./routes/account";
import { questionsRoutes } from "./routes/questions";
import { surveyRoutes } from "./routes/survey";
import { onboardingRoutes } from "./routes/onboarding";
import { createAuthPlugin } from "./auth";
import { Repo } from "./repo";

export const buildServer = () => {
  const env = loadEnv();
  const aws = createAwsClients(env);

  const app = new Elysia({ prefix: "" })
    .decorate("env", env)
    .decorate("aws", aws)
    .decorate("repo", new Repo(aws.doc, env))
    .use(createAuthPlugin(env))
    .use(cookie())
    .onError(({ code, error, set }) => {
      // 스프링의 GlobalExceptionHandler와 동일한 구조의 응답 제공
      if (error instanceof CustomFailError) {
        set.status = error.httpStatus;
        return fail(error.code, error.message);
      }

      // 요청 JSON 파싱 오류 → 400 Fail
      if (code === "VALIDATION" || code === "PARSE") {
        set.status = 400;
        return fail(400, "요청 형식이 올바르지 않습니다.");
      }

      // 기타 예외 → 500 ErrorApiResponse
      set.status = 500;
      return toErrorApi(error, 500);
    });

  // 라우트 연결
  app
    .use(healthRoutes)
    .use(accountRoutes)
    .use(questionsRoutes)
    .use(surveyRoutes)
    .use(onboardingRoutes);

  return app;
};

export type App = ReturnType<typeof buildServer>;
