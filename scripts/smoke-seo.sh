#!/usr/bin/env bash
set -uo pipefail

SITE="${SITE:-https://zhkh24.kz}"
BOT_UA="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
TMP=$(mktemp -d)
ERRORS=0

fail() { echo "❌ $1"; ERRORS=$((ERRORS+1)); }
ok() { echo "✅ $1"; }

fetch() {
  curl -sS -L --retry 3 --retry-delay 5 --max-time 60 -A "$2" -o "$3" -w "%{http_code}" "$1"
}

code=$(fetch "$SITE/robots.txt" "curl/8" "$TMP/robots.txt")
if [ "$code" != "200" ]; then
  fail "robots.txt вернул $code"
else
  ok "robots.txt 200"
  grep -qi '^sitemap:' "$TMP/robots.txt" && ok "robots.txt содержит Sitemap" || fail "robots.txt без директивы Sitemap"
  if awk 'BEGIN{IGNORECASE=1} /^user-agent: *\*/{f=1;next} /^user-agent:/{f=0} f && /^disallow: *\/ *$/{found=1} END{exit !found}' "$TMP/robots.txt"; then
    fail "robots.txt закрывает весь сайт для User-agent: *"
  fi
fi

check_xml() {
  local name="$1"
  local code
  code=$(fetch "$SITE/$name" "curl/8" "$TMP/$name")
  if [ "$code" != "200" ]; then fail "$name вернул $code"; return 1; fi
  if ! xmllint --noout "$TMP/$name" 2>"$TMP/$name.err"; then
    fail "$name невалидный XML: $(head -n 3 "$TMP/$name.err")"; return 1
  fi
  local count
  count=$(grep -c '<loc>' "$TMP/$name")
  if [ "$count" -eq 0 ]; then fail "$name пустой"; return 1; fi
  ok "$name валиден, <loc>: $count"
}

check_xml "sitemap.xml"
check_xml "news-sitemap.xml"

URL_SOURCE="$TMP/sitemap.xml"
if [ -f "$URL_SOURCE" ] && grep -q '<sitemapindex' "$URL_SOURCE"; then
  child=$(grep -oP '(?<=<loc>)[^<]+' "$URL_SOURCE" | head -n 1)
  fetch "$child" "curl/8" "$TMP/child.xml" >/dev/null
  URL_SOURCE="$TMP/child.xml"
fi

if [ -f "$URL_SOURCE" ]; then
  mapfile -t URLS < <(grep -oP '(?<=<loc>)[^<]+' "$URL_SOURCE" | shuf -n 5)
  [ -f "$TMP/news-sitemap.xml" ] && URLS+=("$(grep -oP '(?<=<loc>)[^<]+' "$TMP/news-sitemap.xml" | head -n 1)")

  for u in "${URLS[@]}"; do
    [ -z "$u" ] && continue
    code=$(fetch "$u" "$BOT_UA" "$TMP/page.html")
    if [ "$code" != "200" ]; then fail "$u вернул $code"; continue; fi
    canon=$(grep -oiP '<link[^>]*rel="canonical"[^>]*>' "$TMP/page.html" | head -n 1 | grep -oiP 'href="\K[^"]+')
    if [ -z "$canon" ]; then
      fail "$u: нет canonical"
    elif [ "${canon%/}" != "${u%/}" ]; then
      fail "$u: canonical указывает на $canon"
    elif grep -qiP '<meta[^>]*name="robots"[^>]*noindex' "$TMP/page.html"; then
      fail "$u: страница из sitemap помечена noindex"
    else
      ok "$u"
    fi
  done
fi

rm -rf "$TMP"

if [ "$ERRORS" -gt 0 ]; then
  echo "Ошибок: $ERRORS"
  exit 1
fi
echo "Все проверки пройдены"