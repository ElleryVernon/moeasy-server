// 부트스트랩
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import { buildServer } from "./src/server";

const app = buildServer();

const port = Number(process.env.PORT || 3000);
app.listen(port);
console.log(`Elysia running on http://localhost:${port}`);
