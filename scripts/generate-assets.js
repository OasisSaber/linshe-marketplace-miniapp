/**
 * generate-assets.js — 程序化生成品牌视觉资产（无第三方依赖）
 *
 * 用 Node 内置 zlib 手写 PNG 编码器 + 超采样画布，生成：
 *   - images/brand/logo.png   品牌徽标（绿色小屋）
 *   - images/empty/*.png      空态插画（搜索/收藏/订单）
 *
 * 商品图不在此生成：由 scripts/fetch-stock-images.js 从 Wikimedia Commons
 * 获取真实素材（见 images/goods/SOURCES.md 的来源记录）。
 *
 * 运行：node scripts/generate-assets.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

/* ---------------- PNG 编码器 ---------------- */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([signature, pngChunk("IHDR", ihdr), pngChunk("IDAT", idat), pngChunk("IEND", Buffer.alloc(0))]);
}

/* ---------------- 画布（超采样抗锯齿） ---------------- */

class Canvas {
  constructor(width, height, ss = 3) {
    this.w = width;
    this.h = height;
    this.ss = ss;
    this.W = width * ss;
    this.H = height * ss;
    this.buf = new Float32Array(this.W * this.H * 4); // RGBA 0..1
  }

  blend(px, py, r, g, b, a) {
    if (a <= 0.003) return;
    const i = (py * this.W + px) * 4;
    const ia = 1 - a;
    this.buf[i] = this.buf[i] * ia + r * a;
    this.buf[i + 1] = this.buf[i + 1] * ia + g * a;
    this.buf[i + 2] = this.buf[i + 2] * ia + b * a;
    this.buf[i + 3] = this.buf[i + 3] * ia + a;
  }

  color(c, alpha = 255) {
    return [c[0] / 255, c[1] / 255, c[2] / 255, alpha / 255];
  }

  fillRect(x, y, w, h, color) {
    const [r, g, b, a] = color;
    const sx = Math.max(0, Math.floor(x * this.ss));
    const sy = Math.max(0, Math.floor(y * this.ss));
    const ex = Math.min(this.W, Math.ceil((x + w) * this.ss));
    const ey = Math.min(this.H, Math.ceil((y + h) * this.ss));
    for (let yy = sy; yy < ey; yy++) for (let xx = sx; xx < ex; xx++) this.blend(xx, yy, r, g, b, a);
  }

  // 圆角矩形：中心块 + 上下条 + 四角圆
  roundRect(x, y, w, h, r, color) {
    if (r <= 0) return this.fillRect(x, y, w, h, color);
    this.fillRect(x + r, y, w - 2 * r, h, color);
    this.fillRect(x, y + r, r, h - 2 * r, color);
    this.fillRect(x + w - r, y + r, r, h - 2 * r, color);
    this.ellipse(x + r, y + r, r, r, color);
    this.ellipse(x + w - r, y + r, r, r, color);
    this.ellipse(x + r, y + h - r, r, r, color);
    this.ellipse(x + w - r, y + h - r, r, r, color);
  }

  ellipse(cx, cy, rx, ry, color) {
    const [r, g, b, a] = color;
    const sx = Math.max(0, Math.floor((cx - rx) * this.ss));
    const sy = Math.max(0, Math.floor((cy - ry) * this.ss));
    const ex = Math.min(this.W, Math.ceil((cx + rx) * this.ss));
    const ey = Math.min(this.H, Math.ceil((cy + ry) * this.ss));
    const rxs = rx * rx, rys = ry * ry;
    for (let yy = sy; yy < ey; yy++) {
      const dy = yy / this.ss - cy;
      for (let xx = sx; xx < ex; xx++) {
        const dx = xx / this.ss - cx;
        if ((dx * dx) / rxs + (dy * dy) / rys <= 1) this.blend(xx, yy, r, g, b, a);
      }
    }
  }

  // 椭圆环带（用于拍框/音孔等）
  ringBand(cx, cy, rx1, ry1, rx2, ry2, color) {
    const [r, g, b, a] = color;
    const sx = Math.max(0, Math.floor((cx - rx2) * this.ss));
    const sy = Math.max(0, Math.floor((cy - ry2) * this.ss));
    const ex = Math.min(this.W, Math.ceil((cx + rx2) * this.ss));
    const ey = Math.min(this.H, Math.ceil((cy + ry2) * this.ss));
    for (let yy = sy; yy < ey; yy++) {
      const dy = yy / this.ss - cy;
      for (let xx = sx; xx < ex; xx++) {
        const dx = xx / this.ss - cx;
        const d = (dx * dx) / (rx2 * rx2) + (dy * dy) / (ry2 * ry2);
        if (d <= 1) {
          const din = (dx * dx) / (rx1 * rx1) + (dy * dy) / (ry1 * ry1);
          if (din >= 1) this.blend(xx, yy, r, g, b, a);
        }
      }
    }
  }

  polygon(points, color) {
    const [r, g, b, a] = color;
    const n = points.length;
    let minY = Infinity, maxY = -Infinity;
    for (const p of points) {
      if (p[1] < minY) minY = p[1];
      if (p[1] > maxY) maxY = p[1];
    }
    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      const xs = [];
      for (let i = 0; i < n; i++) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[(i + 1) % n];
        if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) {
          xs.push(x1 + ((y - y1) / (y2 - y1)) * (x2 - x1));
        }
      }
      xs.sort((p, q) => p - q);
      for (let i = 0; i + 1 < xs.length; i += 2) this.fillRect(xs[i], y, xs[i + 1] - xs[i], 1, color);
    }
  }

  // 粗线段（用于拍线/篮球纹/琴弦）
  line(x1, y1, x2, y2, width, color) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const nx = (-dy / len) * width * 0.5;
    const ny = (dx / len) * width * 0.5;
    this.polygon(
      [
        [x1 + nx, y1 + ny],
        [x2 + nx, y2 + ny],
        [x2 - nx, y2 - ny],
        [x1 - nx, y1 - ny]
      ],
      color
    );
  }

  // 线性渐变（对角），c1 左上 → c2 右下
  gradient(x, y, w, h, c1, c2) {
    const [r1, g1, b1] = [c1[0] / 255, c1[1] / 255, c1[2] / 255];
    const [r2, g2, b2] = [c2[0] / 255, c2[1] / 255, c2[2] / 255];
    const sx = Math.max(0, Math.floor(x * this.ss));
    const sy = Math.max(0, Math.floor(y * this.ss));
    const ex = Math.min(this.W, Math.ceil((x + w) * this.ss));
    const ey = Math.min(this.H, Math.ceil((y + h) * this.ss));
    for (let yy = sy; yy < ey; yy++) {
      for (let xx = sx; xx < ex; xx++) {
        const t = (xx / this.ss - x + (yy / this.ss - y)) / (w + h);
        this.blend(
          xx,
          yy,
          r1 + (r2 - r1) * t,
          g1 + (g2 - g1) * t,
          b1 + (b2 - b1) * t,
          1
        );
      }
    }
  }

  toPNG() {
    const out = Buffer.alloc(this.w * this.h * 4);
    const n = this.ss * this.ss;
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        let r = 0, g = 0, b = 0, a = 0;
        for (let sy = 0; sy < this.ss; sy++) {
          for (let sx = 0; sx < this.ss; sx++) {
            const i = ((y * this.ss + sy) * this.W + (x * this.ss + sx)) * 4;
            r += this.buf[i];
            g += this.buf[i + 1];
            b += this.buf[i + 2];
            a += this.buf[i + 3];
          }
        }
        const o = (y * this.w + x) * 4;
        out[o] = Math.round((r / n) * 255);
        out[o + 1] = Math.round((g / n) * 255);
        out[o + 2] = Math.round((b / n) * 255);
        out[o + 3] = Math.round((a / n) * 255);
      }
    }
    return encodePNG(this.w, this.h, out);
  }
}

/* ---------------- 配色 ---------------- */

const WHITE = [255, 255, 255];
const INK = [45, 51, 70];
const SHADOW = [18, 19, 24];

// 分类色系：淡底(左上/右下) + 深主体 + 辅助
const THEME = {
  blue: { light: [232, 240, 255], light2: [244, 248, 255], dark: [37, 99, 235], soft: [147, 197, 253] },
  indigo: { light: [233, 232, 255], light2: [245, 244, 255], dark: [79, 70, 229], soft: [165, 180, 252] },
  orange: { light: [255, 244, 224], light2: [255, 250, 240], dark: [217, 119, 6], soft: [252, 211, 143] },
  green: { light: [228, 250, 235], light2: [243, 252, 246], dark: [22, 163, 74], soft: [134, 239, 172] },
  pink: { light: [255, 233, 242], light2: [255, 244, 249], dark: [219, 39, 119], soft: [249, 168, 212] },
  teal: { light: [230, 250, 248], light2: [242, 252, 251], dark: [13, 148, 136], soft: [153, 246, 228] }
};

function withAlpha(c, alpha) {
  return [c[0], c[1], c[2], alpha];
}


const SIZE = 512;

function drawLogo() {
  const g = new Canvas(SIZE, SIZE, 4);
  // 圆角方底（绿色渐变）
  g.roundRect(28, 28, 456, 456, 120, [34, 197, 94]);
  g.gradient(28, 28, 456, 456, [74, 222, 128], [22, 163, 74]);
  // 屋顶
  g.polygon([[256, 96], [400, 220], [112, 220]], [255, 255, 255]);
  // 屋身
  g.roundRect(150, 220, 212, 180, 12, [255, 255, 255]);
  // 门
  g.roundRect(226, 280, 60, 120, 8, [22, 163, 74]);
  // 窗
  g.roundRect(172, 250, 40, 40, 8, [22, 163, 74]);
  g.roundRect(300, 250, 40, 40, 8, [22, 163, 74]);
  // 烟囱
  g.roundRect(330, 120, 40, 80, 8, [187, 247, 208]);
  // 阳光点
  g.ellipse(96, 120, 22, 22, withAlpha([255, 255, 255], 150));
  return g;
}

/* ---------------- 空态插画 ---------------- */

const EMPTY_SIZE = 320;

function drawEmptySearch() {
  const g = new Canvas(EMPTY_SIZE, EMPTY_SIZE, 3);
  g.gradient(0, 0, EMPTY_SIZE, EMPTY_SIZE, [232, 240, 255], [246, 249, 255]);
  // 放大镜
  g.ringBand(150, 140, 60, 60, 92, 92, [99, 102, 241]);
  g.ringBand(150, 140, 72, 72, 80, 80, [255, 255, 255]);
  g.line(218, 208, 268, 258, 26, [99, 102, 241]);
  g.line(218, 208, 268, 258, 14, [129, 140, 248]);
  // 盒子
  g.roundRect(104, 236, 112, 60, 12, [79, 70, 229]);
  g.fillRect(104, 236, 112, 10, withAlpha([255, 255, 255], 140));
  // 问号
  g.ellipse(150, 152, 22, 22, withAlpha([255, 255, 255], 220));
  g.fillRect(140, 156, 20, 40, withAlpha([255, 255, 255], 220));
  g.ellipse(150, 204, 10, 10, withAlpha([255, 255, 255], 220));
  return g;
}

function drawEmptyFav() {
  const g = new Canvas(EMPTY_SIZE, EMPTY_SIZE, 3);
  g.gradient(0, 0, EMPTY_SIZE, EMPTY_SIZE, [255, 233, 242], [255, 246, 250]);
  // 心形（两个圆 + 三角）
  g.ellipse(122, 130, 46, 46, [236, 72, 153]);
  g.ellipse(198, 130, 46, 46, [236, 72, 153]);
  g.polygon([[160, 214], [96, 156], [224, 156]], [236, 72, 153]);
  // 心内高光
  g.ellipse(116, 122, 18, 18, withAlpha([255, 255, 255], 180));
  // 盒子
  g.roundRect(104, 246, 112, 56, 12, [219, 39, 119]);
  g.fillRect(104, 246, 112, 10, withAlpha([255, 255, 255], 140));
  return g;
}

function drawEmptyOrder() {
  const g = new Canvas(EMPTY_SIZE, EMPTY_SIZE, 3);
  g.gradient(0, 0, EMPTY_SIZE, EMPTY_SIZE, [228, 250, 235], [244, 253, 247]);
  // 单据
  g.roundRect(120, 72, 90, 176, 12, [22, 163, 74]);
  g.roundRect(128, 84, 74, 152, 8, [255, 255, 255]);
  // 线条
  g.fillRect(136, 104, 58, 6, withAlpha([148, 163, 184], 150));
  g.fillRect(136, 122, 58, 6, withAlpha([148, 163, 184], 150));
  g.fillRect(136, 140, 40, 6, withAlpha([148, 163, 184], 150));
  // 对勾
  g.line(148, 178, 164, 196, 12, [34, 197, 94]);
  g.line(164, 196, 196, 154, 12, [34, 197, 94]);
  // 铅笔
  g.polygon([[196, 96], [250, 150], [228, 172], [174, 118]], [104, 110, 128]);
  g.polygon([[238, 158], [252, 172], [238, 186], [224, 172]], [251, 191, 36]);
  return g;
}

/* ---------------- 输出 ---------------- */

const ROOT = path.resolve(__dirname, "..");

function save(relPath, canvas) {
  const out = canvas.toPNG();
  const dest = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, out);
  // 自检：签名 + IDAT 解压长度
  if (out.readUInt32BE(0) !== 0x89504e47) throw new Error(`Bad PNG signature: ${relPath}`);
  const height = out.readUInt32BE(20);
  const width = out.readUInt32BE(16);
  const expected = (width * 4 + 1) * height;
  let found = -1;
  for (let i = 8; i + 12 <= out.length; i++) {
    if (out.toString("ascii", i, i + 4) === "IDAT") {
      const len = out.readUInt32BE(i - 4);
      found = zlib.inflateSync(out.subarray(i + 4, i + 4 + len)).length;
      break;
    }
  }
  if (found !== expected) throw new Error(`PNG data length mismatch ${relPath}: ${found} != ${expected}`);
  console.log(`  ✓ ${relPath}  ${width}x${height}`);
}

console.log("生成品牌徽标…");
save("images/brand/logo.png", drawLogo());

console.log("生成空态插画…");
save("images/empty/empty-search.png", drawEmptySearch());
save("images/empty/empty-fav.png", drawEmptyFav());
save("images/empty/empty-order.png", drawEmptyOrder());

console.log("全部资源生成完成。");
