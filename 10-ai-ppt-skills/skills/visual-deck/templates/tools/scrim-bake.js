// scrim-bake.js — 把 scrim 暗罩烘进背景 PNG
//
// 为什么：html2pptx 不认 CSS gradient。所以 HTML/preview 里常用的
// `background: linear-gradient(rgba(10,10,10,0.7), ...), url(bg.png)` 在 build 时会失败。
// 用 Sharp 把 scrim 预渲染进 PNG，CSS 里只留 `background: url(bg-scrimmed.png)`。
//
// 用法：
//   1. 编辑下面的 PAIRS 数组（或改用 CLI 参数）
//   2. cd 到 deck/ 目录
//   3. node tools/scrim-bake.js
//
// 输出：
//   每张 `NAME.png` 产出一张 `NAME-scrimmed.png`（同目录）
//
// scrim alpha 推荐：
//   - 稀疏文字页（cover / closing）：0.45 - 0.55
//   - 中等密度页：0.60 - 0.65
//   - 密集网格页（多卡片 / 多栏）：0.70 - 0.75

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// ---- 按项目编辑 ----
const BG_DIR = path.resolve(__dirname, '../../asset/backgrounds');  // 项目中的背景图目录
const PAIRS = [
  // ['文件名.png', scrim alpha (0-1)]
  // 例：
  // ['bg-01-cover.png', 0.55],
  // ['bg-07-dense.png', 0.70],
];
// --------------------

(async () => {
  if (!fs.existsSync(BG_DIR)) {
    console.error(`BG_DIR does not exist: ${BG_DIR}`);
    process.exit(1);
  }
  if (PAIRS.length === 0) {
    console.error('PAIRS is empty. Edit scrim-bake.js to specify files + alpha values.');
    process.exit(1);
  }

  for (const [file, alpha] of PAIRS) {
    const src = path.join(BG_DIR, file);
    if (!fs.existsSync(src)) {
      console.warn(`  skip (not found): ${file}`);
      continue;
    }
    const out = path.join(BG_DIR, file.replace(/\.png$/, '-scrimmed.png'));
    const meta = await sharp(src).metadata();
    const overlay = await sharp({
      create: {
        width: meta.width,
        height: meta.height,
        channels: 4,
        background: { r: 10, g: 10, b: 10, alpha },
      },
    }).png().toBuffer();
    await sharp(src).composite([{ input: overlay, blend: 'over' }]).png().toFile(out);
    console.log(`  baked ${file} @ alpha=${alpha} → ${path.basename(out)}`);
  }
})();
