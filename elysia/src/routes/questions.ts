// Questions 라우트 포팅: POST /questions, POST /questions/verifyQrCode, GET /questions, PATCH /questions
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import { Elysia, t } from "elysia";
import { success, fail } from "../responses";
import type {
  QuestionsRequestDto,
  VerifyQrCodeDto,
  QuestionsDto,
  MultipleChoiceIncludeIdQuestionDto,
  ShortAnswerIncludeIdQuestionDto,
  QuestionListDto,
  PatchQuestionTitleDto,
  PatchQuestionTitleResponseDto,
} from "../types";
import { createPresignedGetUrl, uploadPngToS3 } from "../aws";
import { createSignature, generateQrPngBuffer, verifySignature } from "../qr";
// store 제네릭 제거, decorate 로 주입된 store 사용

export const questionsRoutes = new Elysia({ prefix: "/questions" })
  // POST /questions - 설문 저장 및 QR코드 생성
  .post(
    "/",
    async ({
      body,
      store,
      set,
    }: {
      body: unknown;
      store: import("../store").AppStore;
      set: { status: number };
    }) => {
      const dto = body as QuestionsRequestDto;

      // Question 생성 (DynamoDB 저장은 생략/모킹)
      const questionId = Math.floor(Math.random() * 1_000_000);

      const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
      const dataToSign = `expires=${expires}&id=${questionId}`;
      const signature = createSignature(
        dataToSign,
        (store as any).env.URL_SIGNER_SECRET_KEY,
        (store as any).env.URL_SIGNER_ALGORITHM
      );
      const url = `https://mo-easy.com/question/${questionId}?expires=${expires}&signature=${signature}`;

      // QR 생성 및 업로드
      const png = await generateQrPngBuffer(url);
      const key = `${questionId}/qr_code.png`;
      await uploadPngToS3(
        (store as any).aws.s3,
        (store as any).env.S3_QR_BUCKET,
        key,
        png
      );
      const s3Url = await createPresignedGetUrl(
        (store as any).aws.s3,
        (store as any).env.S3_QR_BUCKET,
        key
      );

      return success(201, "success", { url, qrCode: s3Url });
    },
    {
      body: t.Object({
        title: t.String(),
        multipleChoiceQuestions: t.Array(
          t.Object({
            id: t.Number(),
            fixFlag: t.Boolean(),
            question: t.String(),
            choices: t.Array(t.String()),
          })
        ),
        shortAnswerQuestions: t.Array(
          t.Object({
            id: t.Number(),
            fixFlag: t.Boolean(),
            question: t.String(),
            keywords: t.Array(t.String()),
          })
        ),
      }),
    }
  )

  // POST /questions/verifyQrCode - QR 검증 및 설문 조회
  .post(
    "/verifyQrCode",
    async ({
      body,
      set,
      store,
    }: {
      body: unknown;
      set: { status: number };
      store: import("../store").AppStore;
    }) => {
      const v = body as VerifyQrCodeDto;
      const expires = Number(v.expires);
      if (Date.now() > expires) {
        set.status = 400;
        return fail(410, "resource gone");
      }

      const dataToVerify = `expires=${v.expires}&id=${v.questionId}`;
      const ok = verifySignature(
        dataToVerify,
        (store as any).env.URL_SIGNER_SECRET_KEY,
        (store as any).env.URL_SIGNER_ALGORITHM,
        v.signature
      );
      if (!ok) {
        set.status = 400;
        return fail(410, "resource gone");
      }

      // 원본: DB에서 Question.content(JSON) 파싱 → 응답 조립
      // 여기서는 최소 스키마로 그대로 구성
      const parsed: QuestionsDto = {
        multipleChoiceQuestions: [],
        shortAnswerQuestions: [],
      };

      return success(200, "success", {
        title: "title",
        multipleChoiceQuestions: parsed.multipleChoiceQuestions,
        shortAnswerQuestions: parsed.shortAnswerQuestions,
      });
    },
    {
      body: t.Object({
        questionId: t.String(),
        expires: t.String(),
        signature: t.String(),
      }),
    }
  )

  // GET /questions - 생성한 설문지 리스트 조회
  .get("/", async () => {
    const list: QuestionListDto[] = [];
    return success(200, "success", list);
  })

  // PATCH /questions - 설문지 제목 수정
  .patch(
    "/",
    async ({ body }) => {
      const dto = body as PatchQuestionTitleDto;
      const out: PatchQuestionTitleResponseDto = {
        id: dto.id,
        title: dto.title,
      };
      return success(200, "success update title", out);
    },
    {
      body: t.Object({ id: t.Number(), title: t.String() }),
    }
  );
