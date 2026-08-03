const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const pageDirectories = [
  "pages/publish",
  "pages/search",
  "pages/favorites",
  "pages/seller",
  "pages/order"
];

const eventPattern = /\b(?:bindtap|catchtap|bindinput|bindchange|bindconfirm)="([A-Za-z_$][\w$]*)"/g;

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
