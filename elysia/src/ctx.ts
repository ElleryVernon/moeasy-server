// Elysia 컨텍스트 타입 보강
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import type { Context } from "elysia";
import type { AppStore } from "./store";

export type Ctx = Context & { store: AppStore };

