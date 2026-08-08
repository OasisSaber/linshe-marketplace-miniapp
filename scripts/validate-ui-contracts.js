const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const pageDirectories = [
  "pages/publish",
  "pages/search",
  "pages/favorites",
  "pages/seller",
  "pages/order",
  "pages/goods"
];

const eventPattern = /\b(?:bindtap|catchtap|bindinput|bindchange|bindconfirm)="([A-Za-z_$][\w$]*)"/g;

const appJson = JSON.parse(fs.readFileSync(path.join(root, "app.json"), "utf8"));
const { THEME } = require(path.join(root, "config/theme"));
const tokenSource = fs.readFileSync(path.join(root, "styles/tokens.wxss"), "utf8");

function normalizeColor(value) {
  return String(value || "").trim().toLowerCase();
}

const brandMatch = tokenSource.match(/--color-brand:\s*(#[0-9a-f]{6})/i);
const backgroundMatch = tokenSource.match(/--color-bg:\s*(#[0-9a-f]{6})/i);
if (!brandMatch || !backgroundMatch) {
  throw new Error("Missing semantic brand/background tokens");
}

const brandColor = normalizeColor(brandMatch[1]);
const backgroundColor = normalizeColor(backgroundMatch[1]);
if (normalizeColor(THEME.brandColor) !== brandColor) {
  throw new Error("config/theme.js brandColor must match --color-brand");
}
if (normalizeColor(appJson.tabBar.selectedColor) !== brandColor) {
  throw new Error("app.json tabBar.selectedColor must match --color-brand");
}
if (normalizeColor(appJson.window.backgroundColor) !== backgroundColor
    || normalizeColor(appJson.window.navigationBarBackgroundColor) !== backgroundColor) {
  throw new Error("app.json window colors must match --color-bg");
}

for (const directory of pageDirectories) {
  const absolute = path.join(root, directory);
  if (!fs.existsSync(absolute)) continue;

  for (const name of fs.readdirSync(absolute)) {
    if (!name.endsWith(".wxml")) continue;

    const wxmlPath = path.join(absolute, name);
    const jsPath = wxmlPath.replace(/\.wxml$/, ".js");
    if (!fs.existsSync(jsPath)) {
      throw new Error(`Missing page script: ${jsPath}`);
    }

    const wxml = fs.readFileSync(wxmlPath, "utf8");
    const js = fs.readFileSync(jsPath, "utf8");

    for (const match of wxml.matchAll(eventPattern)) {
      const handler = match[1];
      if (!new RegExp(`\\b${handler}\\s*\\(`).test(js)) {
        throw new Error(`Missing handler ${handler} for ${wxmlPath}`);
      }
    }
  }
}

const wxmlFiles = [];
function collectWxml(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) collectWxml(absolute);
    if (entry.isFile() && entry.name.endsWith(".wxml")) wxmlFiles.push(absolute);
  }
}
collectWxml(path.join(root, "pages"));

for (const file of wxmlFiles) {
  const content = fs.readFileSync(file, "utf8");
  const fields = content.match(/<(?:input|textarea)\b[^>]*\bplaceholder="[^"]*"[^>]*>/gs) || [];
  for (const field of fields) {
    if (!/\bplaceholder-class="[^"]+"/.test(field)) {
      throw new Error(`Placeholder must use placeholder-class in ${file}`);
    }
  }
}

const wxssFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(absolute);
    if (entry.isFile() && entry.name.endsWith(".wxss")) wxssFiles.push(absolute);
  }
}
walk(root);

for (const file of wxssFiles) {
  const content = fs.readFileSync(file, "utf8");
  if (/transition\s*:\s*all\b/.test(content)) {
    throw new Error(`Forbidden transition: all in ${file}`);
  }
}

console.log("UI contract check passed.");
