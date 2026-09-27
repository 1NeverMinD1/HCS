import { getImageUrl } from "./getImageUrl.js";

const FORMAT_ORDER = ["thumbnail", "small", "medium", "large"];

export function getResponsiveImage(media, fallbackFormat = "small") {
  if (!media) return { src: "", srcSet: undefined };

  const formats = media.formats || {};
  const candidates = FORMAT_ORDER.map((key) => formats[key]).filter(
    (f) => f && f.url && f.width,
  );
  if (media.url && media.width) {
    candidates.push({ url: media.url, width: media.width });
  }

  const seen = new Set();
  const unique = candidates
    .sort((a, b) => a.width - b.width)
    .filter((f) => {
      if (seen.has(f.width)) return false;
      seen.add(f.width);
      return true;
    });

  const fallback =
    formats[fallbackFormat] || formats.small || formats.medium || media;

  return {
    src: getImageUrl(fallback.url),
    srcSet:
      unique.length > 1
        ? unique.map((f) => `${getImageUrl(f.url)} ${f.width}w`).join(", ")
        : undefined,
  };
}
