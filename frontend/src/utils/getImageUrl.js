const STRAPI_URL = "https://api.zhkh24.kz";

export const getImageUrl = (url) => {
  if (!url) return null;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
};
