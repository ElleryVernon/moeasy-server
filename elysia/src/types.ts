// 공통 응답 타입 정의
// 주석 삭제 금지, 주석 추가 및 개선은 허용

export type SuccessApiResponse<T> = {
  status: "success";
  code: number;
  message: string;
  data: T;
  timestamp: string; // ISO string
};

export type FailApiResponse = {
  status: "fail";
  code: number;
  message: string;
  timestamp: string; // ISO string
};

export type ErrorDetail = {
  type: string; // 예외 클래스 이름 호환
  errorDetail: string;
};

export type ErrorApiResponse = {
  status: "error";
  code: number;
  error: ErrorDetail;
  timestamp: string; // ISO string
};

// DTO 타입들 (스프링과 1:1 호환을 위해 최소 필드만 우선 정의)
// 필요한 범위에서 점진적으로 확장

export type MultipleChoiceIncludeIdQuestionDto = {
  id: number;
  fixFlag: boolean;
  question: string;
  choices: string[];
};

export type ShortAnswerIncludeIdQuestionDto = {
  id: number;
  fixFlag: boolean;
  question: string;
  keywords: string[];
};

export type QuestionsRequestDto = {
  title: string;
  multipleChoiceQuestions: MultipleChoiceIncludeIdQuestionDto[];
  shortAnswerQuestions: ShortAnswerIncludeIdQuestionDto[];
};

export type QuestionsDto = {
  multipleChoiceQuestions: MultipleChoiceIncludeIdQuestionDto[];
  shortAnswerQuestions: ShortAnswerIncludeIdQuestionDto[];
};

export type PatchQuestionTitleDto = {
  id: number;
  title: string;
};

export type PatchQuestionTitleResponseDto = {
  id: number;
  title: string;
};

export type VerifyQrCodeDto = {
  questionId: string;
  expires: string;
  signature: string;
};

export type QuestionResponseDto = {
  title: string;
  multipleChoiceQuestions: MultipleChoiceIncludeIdQuestionDto[];
  shortAnswerQuestions: ShortAnswerIncludeIdQuestionDto[];
};

export type QuestionListDto = {
  id: number;
  surveyId: number;
  title: string;
  createdTime: string | null; // ISO
  expiredTime: string | null; // ISO
  expired: boolean | null;
  url: string | null;
  qrCode: string | null;
  count: number | null;
};

export type SurveySaveRequestDto = {
  questionId: number;
  results: Array<Record<string, string>>;
};

// JSON 값 정밀 타입 (unknown/any 사용 금지)
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  | JsonPrimitive
  | { [key: string]: JsonValue }
  | JsonValue[];
export type QuestionAnswerDto = Record<string, JsonValue>;

export type SurveySaveDto = Array<Record<string, QuestionAnswerDto>>; // @JsonValue 호환

// Account 관련
export type MobileKakasSdkTokenDto = { accessToken: string };
export type AppLoginTokenDto = {
  accessToken: string;
  refreshToken: string;
  email: string;
  name: string;
};
export type TokenDto = { accessToken: string; refreshToken: string };
export type RefreshDto = { refreshToken?: string };
export type ProfileDto = { email: string; name: string; profileUrl: string };
