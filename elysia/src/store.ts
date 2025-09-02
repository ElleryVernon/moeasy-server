// Elysia store 타입 정의
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import type { Env } from "./env";
import type { AwsClients } from "./aws";
import type { Repo } from "./repo";

export type AppStore = {
  env: Env;
  aws: AwsClients;
  repo: Repo;
};
