// build.js — 视觉版 deck 构建入口
//
// 约定：
//   slides/slideNN.html 为每页
//   images/ 或 ../asset/backgrounds/ 放背景图（可选）
//   notes-map.js 为溢出文案映射
//
// 用法：
//   node build.js          → 检验所有 slide，全通过就写 pptx
//   node build.js --lint   → 只检验，不写 pptx（CI / 快速反馈）
//   node build.js --strict → 第一个错误就中断（旧行为）
//
// 默认行为已改为"收齐所有 slide 的错误一次汇报"——
// 避免改一条 build 一次、撞一条再改的疲劳循环。

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

const args = process.argv.slice(2);
const LINT_ONLY = args.includes('--lint');
const STRICT = args.includes('--strict');

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

  const failures = [];

  for (const file of files) {
    const m = file.match(/^slide(\d+)\.html$/);
    const num = parseInt(m[1], 10);
    process.stdout.write(`Checking ${file}... `);
    try {
      const before = pptx.slides.length;
      await html2pptx(path.join(slidesDir, file), pptx);
      const after = pptx.slides.length;
      if (notesMap[num] && after > before) {
        pptx.slides[after - 1].addNotes(notesMap[num]);
      }
      console.log('ok');
    } catch (e) {
      console.log('FAIL');
      failures.push({ file, message: e.message });
      if (STRICT) break;
    }
  }

  if (failures.length > 0) {
    console.error(`\n${'='.repeat(60)}`);
    console.error(`${failures.length} / ${files.length} slide(s) failed validation:`);
    console.error('='.repeat(60));
    for (const { file, message } of failures) {
      console.error(`\n${file}`);
      const lines = message.split('\n').filter(Boolean);
      for (const line of lines) {
        console.error(`  ${line.trim()}`);
      }
    }
    console.error(`\n→ See references/html2pptx-contract.md for how to fix each type of error.`);
    console.error(`→ Or run 'node templates/tools/fix-html-for-pptx.js' for auto-fixable issues.`);
    process.exit(1);
  }

  if (LINT_ONLY) {
    console.log(`\nLint OK. ${files.length} slide(s) would build. (--lint mode, skipping pptx write)`);
    return;
  }

  await pptx.writeFile({ fileName: path.join(__dirname, OUT_FILE) });
  console.log(`\nWritten: ${OUT_FILE}`);
}

build().catch(e => { console.error(e); process.exit(1); });
