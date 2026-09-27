const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "../frontend/dist");
const HTML_PATH = path.join(DIST, "index.html");
const LINK_RE =
  /<link\s+rel="stylesheet"[^>]*href="(\/assets\/index-[^"]+\.css)"[^>]*>/;

const html = fs.readFileSync(HTML_PATH, "utf-8");
const match = html.match(LINK_RE);

if (!match) {
  console.log("inline-css: main stylesheet link not found, skipped");
  process.exit(0);
}

const cssPath = path.join(DIST, match[1]);
const css = fs.readFileSync(cssPath, "utf-8");
const result = html.replace(match[0], () => `<style>${css}</style>`);

fs.writeFileSync(HTML_PATH, result, "utf-8");
console.log(
  `inline-css: inlined ${match[1]} (${(css.length / 1024).toFixed(1)} KB)`,
);
