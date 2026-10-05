import crypto from "crypto";

const TTL = 60 * 60 * 2;

export const PREVIEW_TYPES: Record<string, string> = {
  article: "api::article.article",
  blog: "api::blog.blog",
  event: "api::event.event",
  news: "api::new.new",
  qna: "api::q-and-a.q-and-a",
};

const sign = (payload: string, secret: string) =>
  crypto.createHmac("sha256", secret).update(payload).digest("hex");

export const createPreviewToken = (
  type: string,
  documentId: string,
  secret: string,
) => {
  const exp = Math.floor(Date.now() / 1000) + TTL;
  return `${exp}.${sign(`${type}:${documentId}:${exp}`, secret)}`;
};

export const verifyPreviewToken = (
  token: string | undefined,
  type: string,
  documentId: string,
  secret: string | undefined,
) => {
  if (!token || !secret) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!exp || !sig || exp < Math.floor(Date.now() / 1000)) return false;
  const expected = sign(`${type}:${documentId}:${exp}`, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};
