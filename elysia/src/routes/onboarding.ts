// OnBoarding 라우트 포팅: POST /questions/onBoarding, POST /questions/make
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import { Elysia, t } from "elysia";
import { success } from "../responses";

export const onboardingRoutes = new Elysia({ prefix: "/questions" })
  .post(
    "/onBoarding",
    ({ body }) => {
      // 입력을 그대로 반영한 mock 응답
      return success(200, "success", []);
    },
    {
      body: t.Object({
        productType: t.String(),
        domain: t.String(),
        purpose: t.String(),
        description: t.String(),
      }),
    }
  )
  .post("/make", ({ body }) => {
    return success(200, "successfully generated the problems", {
      title: "title",
      multipleChoiceQuestions: [],
      shortAnswerQuestions: [],
    });
  });

