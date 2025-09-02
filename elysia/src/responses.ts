// 공통 응답 헬퍼
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import type {
  SuccessApiResponse,
  FailApiResponse,
  ErrorApiResponse,
  ErrorDetail,
} from "./types";

export const success = <T>(
  code: number,
  message: string,
  data: T
): SuccessApiResponse<T> => ({
  status: "success",
  code,
  message,
  data,
  timestamp: new Date().toISOString(),
});

export const fail = (code: number, message: string): FailApiResponse => ({
  status: "fail",
  code,
  message,
  timestamp: new Date().toISOString(),
});

export const error = (code: number, detail: ErrorDetail): ErrorApiResponse => ({
  status: "error",
  code,
  error: detail,
  timestamp: new Date().toISOString(),
});

