// check-overflow.js — headless 检测每页是否超过 540px (= 405pt) 视口
//
// 为什么：浏览器 iframe 里肉眼扫不出 ≤5px 的溢出；而这种溢出在 build/pptx 里会导致报错。
// 用 playwright 在 960×540 视口下渲染每张 slide，对 body.scrollHeight 做硬门槛检测。
//
// 用法：
//   cd deck/
//   npm i playwright  (若未装)
//   node tools/check-overflow.js
//
// 注意：
//   - 本脚本只做 preview 级检查（540px 硬边界）。
//   - build.js 的 36pt 底边要求更严（实际可用 ~504px）。
//     要两层都过，要么进一步压缩内容，要么用 `node build.js --lint` 做严格检查。

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SLIDES_DIR = path.resolve(__dirname, '../slides');
const VIEWPORT = { width: 960, height: 540 };
const TOLERANCE_PX = 2; // 小于 2px 的溢出当作通过（亚像素四舍五入）

(async () => {
  if (!fs.existsSync(SLIDES_DIR)) {
    console.error(`Slides dir not found: ${SLIDES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(SLIDES_DIR)
    .filter(f => /^slide\d+\.html$/.test(f))
    .sort();

  if (files.length === 0) {
    console.error('No slide files found.');
    process.exit(1);
  }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();

  console.log(`Checking ${files.length} slides @ ${VIEWPORT.width}x${VIEWPORT.height}:\n`);
  const results = [];

  for (const f of files) {
    const url = 'file://' + path.join(SLIDES_DIR, f);
    await page.goto(url, { waitUntil: 'networkidle' });
    const m = await page.evaluate(() => ({
      scrollH: document.body.scrollHeight,
      scrollW: document.body.scrollWidth,
    }));
    const overflowV = m.scrollH - VIEWPORT.height;
    const overflowH = m.scrollW - VIEWPORT.width;
    const vMark = overflowV > TOLERANCE_PX ? 'OVERFLOW' : 'ok';
    console.log(
      `  ${f}  H=${m.scrollH}px  (${overflowV >= 0 ? '+' : ''}${overflowV}px)  ${vMark}` +
      (overflowH > TOLERANCE_PX ? `  [hORz +${overflowH}]` : '')
    );
    results.push({ f, scrollH: m.scrollH, overflowV });
  }

  await browser.close();

  const bad = results.filter(r => r.overflowV > TOLERANCE_PX);
  console.log(`\n${bad.length} / ${results.length} slide(s) overflow:`);
  bad.forEach(r => console.log(`  ${r.f}  +${r.overflowV}px`));

  process.exit(bad.length > 0 ? 1 : 0);
})();
