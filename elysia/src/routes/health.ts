// Health routes (분리된 모듈)
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import { Elysia } from "elysia";
import { success, fail } from "../responses";

export const healthRoutes = new Elysia({ prefix: "" })
  .get("/healthcheck", () =>
    success(
      200,
      "The server is operating normally",
      "경우에 따라 Map || LIST 가 담길 예정"
    )
  )
  .get("/fail", ({ set }) => {
    set.status = 400;
    return fail(404, "no resource");
  })
  .get("/error", ({ set }) => {
    set.status = 500;
    return {
      status: "error",
      code: 500,
      error: { type: "ValidationException", errorDetail: "server error." },
      timestamp: new Date().toISOString(),
    };
  });

