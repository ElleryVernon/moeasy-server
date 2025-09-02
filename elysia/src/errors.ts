// 전역 에러 타입 및 변환기
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import { error as errorResponse } from "./responses";

export class CustomFailError extends Error {
  // 스프링의 CustomFailException 대응
  public readonly httpStatus: number;
  public readonly code: number;

  constructor(httpStatus: number, code: number, message: string) {
    super(message);
    this.name = "CustomFailException";
    this.httpStatus = httpStatus;
    this.code = code;
  }
}

export const toErrorApi = (e: unknown, code = 500) => {
  const detail = {
    type: e instanceof Error ? e.name : "UnknownError",
    errorDetail:
      e instanceof Error ? e.message || "server error" : "server error",
  };
  return errorResponse(code, detail);
};

