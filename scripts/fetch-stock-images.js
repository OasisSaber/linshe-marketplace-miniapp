/**
 * fetch-stock-images.js — 从 Wikimedia Commons 获取无版权/自由许可商品图
 *
 * 为 data/items.js 中 19 个演示商品获取真实照片，并记录来源：
 *   - 图片文件 → images/goods/<slug>.<ext>
 *   - 来源记录 → images/goods/SOURCES.md（标题 / 作者 / 许可证 / 原图 URL）
 *
 * 许可策略：优先 CC0 / Public domain / CC BY；接受 CC BY-SA（需署名，已在
 * SOURCES.md 记录）。不采用含 NC / ND 限制的素材。
 *
 * 运行：node scripts/fetch-stock-images.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "images", "goods");
const API = "https://commons.wikimedia.org/w/api.php";
const THUMB_WIDTH = 480;
const UA = "linshe-marketplace-miniapp/1.0 (portfolio demo; education use)";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, retries = 4) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429 || res.status >= 500) {
        if (attempt < retries) {
          await sleep(2500 * attempt);
          continue;
        }
      }
      return res;
    } catch (err) {
      if (attempt < retries) {
        await sleep(2500 * attempt);
        continue;
      }
      throw err;
    }
  }
  throw new Error(`fetch failed: ${url}`);
}

// slug 与数据 data/items.js 的商品一一对应（按 item_id 顺序）
const QUERIES = [
  { slug: "book", query: "mathematics textbook" },
  { slug: "macbook", query: "MacBook Air laptop computer" },
  { slug: "dyson", query: "Dyson cordless vacuum cleaner" },
  { slug: "fridge", query: "mini fridge refrigerator" },
  { slug: "notes", query: "textbook mathematics algebra" },
  { slug: "cet", query: "English language textbook" },
  { slug: "ipad", query: "iPad tablet computer" },
  { slug: "keyboard", query: "Logitech wireless keyboard" },
  { slug: "desk", query: "writing desk wooden" },
  { slug: "basketball", query: "basketball ball orange" },
  { slug: "yoga", query: "yoga mat" },
  { slug: "badminton", query: "badminton racket" },
  { slug: "backpack", query: "school backpack" },
  { slug: "jacket", query: "denim jacket" },
  { slug: "boots", query: "black leather boots" },
  { slug: "shirt", query: "white shirt" },
  { slug: "guitar", query: "acoustic guitar" },
  { slug: "speaker", query: "portable Bluetooth speaker" },
  { slug: "midi", query: "MIDI keyboard controller" }
];

const LIC_ACCEPT = /^(CC0|Public domain|CC BY)/; // 允许：CC0 / PD / CC BY / CC BY-SA
const LIC_PREFER = /^(CC0|Public domain|CC BY(?!-SA))/; // 优先：无需署名或仅署名

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function search(query, signal) {
  const url =
    `${API}?action=query&format=json&generator=search` +
    `&gsrsearch=${encodeURIComponent(`filetype:bitmap ${query}`)}` +
    `&gsrnamespace=6&gsrlimit=6` +
    `&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=${THUMB_WIDTH}`;
  const res = await fetchWithRetry(url, { signal, headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`API ${res.status}: ${query}`);
  const data = await res.json();
  const pages = data.query && data.query.pages ? Object.values(data.query.pages) : [];
  return pages
    .map((p) => {
      const ii = p.imageinfo && p.imageinfo[0];
      if (!ii) return null;
      const meta = ii.extmetadata || {};
      const license = stripHtml(meta.LicenseShortName && meta.LicenseShortName.value);
      const artist = stripHtml(meta.Artist && meta.Artist.value);
      const title = stripHtml(meta.ImageDescription && meta.ImageDescription.value) || p.title;
      return {
        title: p.title,
        description: title,
        artist,
        license,
        thumb: ii.thumburl || ii.url,
        url: ii.descriptionurl || ii.url
      };
    })
    .filter(Boolean);
}

function pick(candidates) {
  const accepted = candidates.filter((c) => LIC_ACCEPT.test(c.license));
  if (!accepted.length) return null;
  return accepted.find((c) => LIC_PREFER.test(c.license)) || accepted[0];
}

async function download(url, dest, signal) {
  const res = await fetchWithRetry(url, { signal, headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`download ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

const MAX_KEEP_BYTES = 1.2 * 1024 * 1024; // 超过此大小的已有文件强制重下（小图）

function readExistingSources() {
  const srcPath = path.join(OUT_DIR, "SOURCES.md");
  if (!fs.existsSync(srcPath)) return {};
  const map = {};
  for (const line of fs.readFileSync(srcPath, "utf8").split("\n")) {
    if (!line.startsWith("| ")) continue;
    const cells = line.split("|").slice(1, -1).map((s) => s.trim());
    if (cells.length >= 6 && cells[0] !== "商品 slug") {
      map[cells[0]] = { file: cells[1], title: cells[2], artist: cells[3], license: cells[4], url: cells[5] };
    }
  }
  return map;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const existing = readExistingSources();
  const rows = [];
  let ok = 0;
  let skipped = 0;
  for (const { slug, query } of QUERIES) {
    const currentFile = existing[slug] && existing[slug].file;
    if (currentFile) {
      const cur = path.join(OUT_DIR, currentFile);
      if (fs.existsSync(cur) && fs.statSync(cur).size <= MAX_KEEP_BYTES) {
        rows.push({ slug, ...existing[slug], bytes: fs.statSync(cur).size });
        console.log(`○ ${slug} 已存在（跳过，${existing[slug].license}）`);
        skipped++;
        continue;
      }
    }
    const signal = AbortSignal.timeout(30000);
    try {
      const candidates = await search(query, signal);
      await sleep(2500); // Wikimedia 限流：请求间退避
      const pickResult = pick(candidates);
      if (!pickResult) {
        console.warn(`✗ ${slug}（${query}）: 未找到可接受的自由许可图片`);
        continue;
      }
      const extMatch = /\.(jpe?g|png|gif|webp)(?:\?|$)/i.exec(pickResult.thumb);
      const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";
      const destName = `${slug}.${ext === "jpeg" ? "jpg" : ext}`;
      const dest = path.join(OUT_DIR, destName);
      const bytes = await download(pickResult.thumb, dest, signal);
      rows.push({
        slug,
        file: destName,
        title: pickResult.description,
        artist: pickResult.artist,
        license: pickResult.license,
        url: pickResult.url,
        bytes
      });
      console.log(`✓ ${slug} → ${destName} (${(bytes / 1024).toFixed(0)} KB, ${pickResult.license})`);
      ok++;
    } catch (err) {
      console.warn(`✗ ${slug}（${query}）: ${err.message}`);
    }
  }

  // 来源记录（新下载 + 跳过保留合并）
  const date = new Date().toISOString().slice(0, 10);
  const lines = [
    "# 商品图片来源记录（SOURCES）",
    "",
    `> 素材来源：Wikimedia Commons（自由许可）。获取日期：${date}。`,
    "> 许可说明：CC0 / Public domain 可直接使用；CC BY / CC BY-SA 需按本表署名。",
    "",
    "| 商品 slug | 文件 | 图片标题 | 作者 | 许可证 | 原图链接 |",
    "| --- | --- | --- | --- | --- | --- |"
  ];
  const order = QUERIES.map((q) => q.slug);
  rows.sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
  for (const r of rows) {
    const artist = (r.artist || "—").replace(/\|/g, "/");
    const title = r.title.replace(/\|/g, "/");
    lines.push(`| ${r.slug} | ${r.file} | ${title} | ${artist} | ${r.license} | ${r.url} |`);
  }
  fs.writeFileSync(path.join(OUT_DIR, "SOURCES.md"), lines.join("\n") + "\n");
  console.log(`\n完成：成功 ${ok}，跳过 ${skipped}，共 ${rows.length}/${QUERIES.length}，来源记录已写入 images/goods/SOURCES.md`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
