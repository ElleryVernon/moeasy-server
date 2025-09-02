// Survey 라우트 포팅: GET /survey, POST /survey
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import { Elysia, t } from "elysia";
import { success, fail } from "../responses";
import type { SurveySaveRequestDto } from "../types";

export const surveyRoutes = new Elysia({})
  // GET /survey?surveyId=123
  .get(
    "/survey",
    ({ query, set }) => {
      const surveyId = Number(query["surveyId"]);
      if (!Number.isFinite(surveyId)) {
        set.status = 404;
        return fail(404, "no resource");
      }

      // 원본: summarizeJson 파싱 + expired, expiredTime 합성
      // 여기서는 비어있는 결과를 기본 반환
      return success(200, "성공적으로 결과지 조회를 완료했습니다.", {});
    },
    {
      query: t.Object({ surveyId: t.String() }),
    }
  )

  // POST /survey
  .post(
    "/survey",
    async ({ body }) => {
      const dto = body as SurveySaveRequestDto;
      const surveyId = 1; // mock id
      const surveyUrl = `https://mo-easy.com/reporting/${surveyId}`;
      return success(200, "성공적으로 저장하였습니다.", {
        surveyId: String(surveyId),
        surveyUrl,
      });
    },
    {
      body: t.Object({
        questionId: t.Number(),
        results: t.Array(t.Record(t.String(), t.String())),
      }),
    }
  );

