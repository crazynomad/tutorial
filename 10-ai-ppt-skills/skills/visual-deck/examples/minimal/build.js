// build.js — 视觉版 deck 构建入口
// 约定：slides/slideNN.html 为每页，images/slideNN.png 为背景图（可选），
// notes-map.js 为溢出文案映射。
//
// 用法： node build.js

const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const html2pptx = require('./html2pptx');
const notesMap = require('./notes-map');

// ---- 配置（按项目调整） ----
const META = {
  title: 'Visual Deck',
  author: 'Author',
  subject: 'Internal Sharing',
};
const OUT_FILE = 'deck.pptx';
// ---------------------------

async function build() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9'; // 对应 HTML body: 720pt × 405pt
  pptx.title = META.title;
  pptx.author = META.author;
  pptx.subject = META.subject;

  const slidesDir = path.join(__dirname, 'slides');
  const files = fs.readdirSync(slidesDir)
    .filter(f => /^slide\d+\.html$/.test(f))
    .sort();

  if (files.length === 0) {
    throw new Error(`No slides found in ${slidesDir}`);
  }

  for (const file of files) {
    const m = file.match(/^slide(\d+)\.html$/);
    const num = parseInt(m[1], 10);
    console.log(`Building ${file}...`);
    const before = pptx.slides.length;
    await html2pptx(path.join(slidesDir, file), pptx);
    const after = pptx.slides.length;
    if (notesMap[num] && after > before) {
      pptx.slides[after - 1].addNotes(notesMap[num]);
    }
  }

  await pptx.writeFile({ fileName: path.join(__dirname, OUT_FILE) });
  console.log(`Written: ${OUT_FILE}`);
}

build().catch(e => { console.error(e); process.exit(1); });
