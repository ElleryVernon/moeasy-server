# moeasy-server-elysia

Spring 기반 API를 Bun + Elysia(TypeScript)로 1:1 호환되게 포팅한 서버입니다.

## 실행

1. 의존성 설치

```
bun install
```

2. 환경 변수 설정

```
cp .env.example .env
# 값 채우기
```

3. 개발 서버

```
bun run index.ts
```

## 엔드포인트

- GET `/healthcheck`, GET `/fail`, GET `/error`
- POST `/account/login`, POST `/account/refresh`, POST `/account/logout`, GET `/account`
- POST `/questions`, POST `/questions/verifyQrCode`, GET `/questions`, PATCH `/questions`
- GET `/survey`, POST `/survey`
- POST `/questions/onBoarding`, POST `/questions/make`

응답 스펙은 스프링의 `SuccessApiResponseDto`, `FailApiResponseDto`, `ErrorApiResponseDto`를 그대로 모사합니다.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
