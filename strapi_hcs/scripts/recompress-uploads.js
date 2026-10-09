const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const dirArg = process.argv.find((a) => a.startsWith("--dir="));
const DIR = path.resolve(dirArg ? dirArg.slice(6) : "public/uploads");
const APPLY = process.argv.includes("--apply");
const CONCURRENCY = 2;
const MIN_SAVING = 0.05;
const EXTS = new Set([".webp", ".jpg", ".jpeg", ".png"]);

sharp.cache(false);
sharp.concurrency(1);

async function encode(ext, input) {
  const img = sharp(input, { failOn: "none" });
  const meta = await img.metadata();
  if ((meta.pages || 1) > 1) return null;

  if (ext === ".webp") {
    return img.rotate().webp({ quality: 68, effort: 5 }).toBuffer();
  }
  if (ext === ".jpg" || ext === ".jpeg") {
    return img.rotate().jpeg({ quality: 75, mozjpeg: true }).toBuffer();
  }
  if (ext === ".png") {
    return img
      .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 })
      .toBuffer();
  }
  return null;
}

async function processFile(file, stats) {
  const ext = path.extname(file).toLowerCase();
  if (!EXTS.has(ext)) {
    stats.skipped++;
    return;
  }

  try {
    const input = await fs.readFile(file);
    const output = await encode(ext, input);

    if (!output || output.length >= input.length * (1 - MIN_SAVING)) {
      stats.kept++;
      return;
    }

    stats.changed++;
    stats.before += input.length;
    stats.after += output.length;

    if (APPLY) {
      const st = await fs.stat(file);
      const tmp = `${file}.recompress.tmp`;
      await fs.writeFile(tmp, output);
      await fs.chmod(tmp, st.mode);
      await fs.rename(tmp, file);
    }
  } catch (e) {
    stats.errors++;
    console.error(`ERR ${file}: ${e.message}`);
  }
}

function mb(bytes) {
  return (bytes / 1024 / 1024).toFixed(1);
}

async function run() {
  const entries = await fs.readdir(DIR, {
    withFileTypes: true,
    recursive: true,
  });
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => path.join(e.parentPath || e.path, e.name));

  console.log(
    `${APPLY ? "APPLY" : "DRY RUN"}: ${files.length} файлов в ${DIR}`,
  );

  const stats = {
    changed: 0,
    kept: 0,
    skipped: 0,
    errors: 0,
    before: 0,
    after: 0,
  };
  let index = 0;
  let done = 0;

  async function worker() {
    while (index < files.length) {
      const file = files[index++];
      await processFile(file, stats);
      done++;
      if (done % 250 === 0) {
        console.log(
          `${done}/${files.length} | сжато ${stats.changed} | экономия ${mb(stats.before - stats.after)} МБ`,
        );
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  console.log("----");
  console.log(`Сжато файлов: ${stats.changed}`);
  console.log(`Оставлено как есть: ${stats.kept}`);
  console.log(`Пропущено (не картинки): ${stats.skipped}`);
  console.log(`Ошибок: ${stats.errors}`);
  console.log(
    `Было ${mb(stats.before)} МБ → стало ${mb(stats.after)} МБ, экономия ${mb(stats.before - stats.after)} МБ`,
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
