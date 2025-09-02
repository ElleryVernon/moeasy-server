// 저장소 도메인 타입
// 주석 삭제 금지, 주석 추가 및 개선은 허용

export type MemberItem = {
  pk: string; // `member#<email>`
  sk: "meta";
  id: number; // numeric id
  email: string;
  name: string;
  profileKey?: string | null; // e.g., `${id}/profile.png`
  createdAt: string; // ISO
};

export type RefreshTokenItem = {
  pk: string; // `refresh#<email>`
  sk: "meta";
  token: string;
  updatedAt: string; // ISO
};

export type QuestionItem = {
  pk: string; // `question#<id>`
  sk: "meta";
  id: number;
  memberId: number;
  title: string;
  content: string; // JSON string of QuestionsDto
  surveyId: number;
  urlInQrCode?: string | null;
  createdTime: string; // ISO
  expiredTime?: string | null; // ISO
  expired?: boolean | null;
  count?: number | null;
};

export type SurveyItem = {
  pk: string; // `survey#<id>`
  sk: "meta";
  id: number;
  questionId: number;
  resultsJson: string; // JSON string of SurveySaveDto
  summarizeJson?: string | null;
  lastUpdated?: string | null; // ISO
};

