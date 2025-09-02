// QR 코드 생성 및 URL 서명
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import QRCode from "qrcode";
import { createHmac, timingSafeEqual } from "node:crypto";

export const createSignature = (
  data: string,
  secretKey: string,
  algorithm: string
) => {
  const hmac = createHmac(algorithm, secretKey);
  hmac.update(data);
  return hmac.digest("base64url"); // Base64 URL-safe, padding 제거
};

export const verifySignature = (
  data: string,
  secretKey: string,
  algorithm: string,
  signature: string
) => {
  const expected = createSignature(data, secretKey, algorithm);
  // 안전 비교
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
};

export const generateQrPngBuffer = async (url: string): Promise<Uint8Array> => {
  // qrcode 라이브러리의 toBuffer는 Node Buffer를 반환하므로 Uint8Array 호환
  const buf = await QRCode.toBuffer(url, {
    type: "png",
    width: 400,
    margin: 1,
  });
  return new Uint8Array(buf);
};

