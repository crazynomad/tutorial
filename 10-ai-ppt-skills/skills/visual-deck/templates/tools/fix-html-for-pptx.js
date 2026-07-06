// fix-html-for-pptx.js — 自动修 html2pptx 契约违规
//
// 覆盖契约规则：
//   规则 3：<p>/<h1-6>/<ul>/<ol> 等文本元素不能有 background/border*/box-shadow
//   规则 4：<div> 不能直接含裸文本
//   规则 7：<div> 的直接子 <span> 文字在 PPTX 里会静默消失
//   规则 8：全局 CSS reset · p/h1-6/ul/ol margin 默认值防止 overflow
//
// 修复策略（执行顺序）：
//   1. 规则 3：带 bg/border 的 <p class="FOO">...</p> → <div class="FOO"><p>...</p></div>
//   2. 规则 7：仅含 <span> 子节点的 <div class="BAR"> → top-level <span> 全换成 <p>，并加 .BAR p { margin: 0 } 样式
//   3. 规则 3 再跑一轮：5a + 5b 组合坑 · 规则 7 产出的 <p class="X"> 若 X 有 bg，再次包成 div+p
//   4. 规则 8：每个 slide 的 <style> 头部注入全局 reset（幂等 · 已存在则跳过）
//
// class 匹配走"whitespace token"精确比对，不会把 .shot 匹进 <p class="shot-no">。
//
// 用法：
//   cd deck/
//   node tools/fix-html-for-pptx.js
//
// 幂等：多次运行只会处理新产生的违规，不会反复嵌套。

const fs = require('fs');
const path = require('path');

const SLIDES_DIR = path.resolve(__dirname, '../slides');
const files = fs.readdirSync(SLIDES_DIR)
  .filter(f => /^slide\d+\.html$/.test(f))
  .sort();

let fixedCount = 0;

for (const f of files) {
  const fp = path.join(SLIDES_DIR, f);
  let html = fs.readFileSync(fp, 'utf8');
  const before = html;

  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  if (!styleMatch) continue;
  const cssBlock = styleMatch[1];

  // --- 规则 3 修复 ---
  const bgClasses = new Set();
  const ruleMatches = cssBlock.matchAll(/\.([a-zA-Z0-9_-]+)\s*\{([^}]*)\}/g);
  for (const m of ruleMatches) {
    const name = m[1];
    const body = m[2];
    if (
      /(^|;|\s)background\s*:/.test(body) ||
      /(^|;|\s)border(?:-left|-right|-top|-bottom)?\s*:/.test(body) ||
      /(^|;|\s)box-shadow\s*:/.test(body)
    ) {
      bgClasses.add(name);
    }
  }

  const convertedR3 = new Set();
  const applyR3 = () => {
    html = html.replace(
      /<p(\s[^>]*?)class="([^"]+)"([^>]*)>([\s\S]*?)<\/p>/g,
      (full, pre, classAttr, post, body) => {
        const tokens = classAttr.split(/\s+/).filter(Boolean);
        const hit = tokens.find(t => bgClasses.has(t));
        if (!hit) return full;
        if (/^\s*<p>[\s\S]*<\/p>\s*$/.test(body)) return full;
        convertedR3.add(hit);
        return `<div${pre}class="${classAttr}"${post}><p>${body}</p></div>`;
      }
    );
  };
  applyR3();

  // --- 规则 7 修复 ---
  // 只拿"直接子节点只有 span + whitespace"的 div（允许 span 内嵌 1 层 span）
  const spanTagToken = '<span(?:\\s[^>]*)?>(?:[^<]|<span(?:\\s[^>]*)?>[^<]*<\\/span>)*<\\/span>';
  const divOnlySpansRe = new RegExp(
    `<div(\\s[^>]*?)class="([^"]+)"([^>]*)>(\\s*(?:${spanTagToken}\\s*){2,})<\\/div>`,
    'g'
  );
  const convertedR7 = new Set();
  html = html.replace(divOnlySpansRe, (full, pre, classAttr, post, body) => {
    // 把每个 top-level <span ...>...</span> 转成 <p ...>...</p>
    const newBody = body.replace(
      new RegExp(spanTagToken, 'g'),
      (spanFull) => {
        // 只改最外层标签
        const openEnd = spanFull.indexOf('>') + 1;
        const open = spanFull.slice(0, openEnd);
        const inner = spanFull.slice(openEnd, -'</span>'.length);
        const newOpen = open.replace(/^<span/, '<p').replace(/\s*\/?>$/, '>');
        return `${newOpen}${inner}</p>`;
      }
    );
    const mainClass = classAttr.split(/\s+/)[0];
    convertedR7.add(mainClass);
    return `<div${pre}class="${classAttr}"${post}>${newBody}</div>`;
  });

  // 为规则 7 修复的类注入 "CLASS p { margin: 0 }" 规则（如果还没有）
  if (convertedR7.size > 0) {
    const styleStart = html.indexOf('<style>') + '<style>'.length;
    const styleEnd = html.indexOf('</style>');
    let newStyle = html.slice(styleStart, styleEnd);
    for (const cls of convertedR7) {
      const marker = `.${cls} p { margin: 0`;
      if (!newStyle.includes(marker)) {
        newStyle = newStyle + `\n.${cls} p { margin: 0; }`;
      }
    }
    html = html.slice(0, styleStart) + newStyle + html.slice(styleEnd);
  }

  // --- 规则 3 第二轮 · 套路 5b 处理 R7 新产出的 <p class="X"> ---
  // 如果规则 7 把 span 转成了 p · 而目标 class 恰好有 bg/border · 需要再包一层 div
  if (convertedR7.size > 0) {
    applyR3();
  }

  // --- 规则 8 修复 · 注入全局 CSS reset（防止 <p>/<h>/<ul> 默认 margin 引起 overflow）---
  const resetRule = 'p, h1, h2, h3, h4, h5, h6, ul, ol { margin: 0; padding: 0; }';
  let injectedR8 = false;
  if (!html.includes(resetRule)) {
    const styleOpen = '<style>';
    const styleStart = html.indexOf(styleOpen);
    if (styleStart !== -1) {
      const insertAt = styleStart + styleOpen.length;
      html = html.slice(0, insertAt) + '\n' + resetRule + '\n' + html.slice(insertAt);
      injectedR8 = true;
    }
  }

  if (html !== before) {
    fs.writeFileSync(fp, html);
    fixedCount++;
    const r3Str = convertedR3.size ? `R3[${[...convertedR3].join(', ')}]` : '';
    const r7Str = convertedR7.size ? `R7[${[...convertedR7].join(', ')}]` : '';
    const r8Str = injectedR8 ? 'R8[reset-injected]' : '';
    console.log(`  ${f}: ${[r3Str, r7Str, r8Str].filter(Boolean).join('  ')}`);
  }
}

console.log(`\n${fixedCount} / ${files.length} file(s) changed`);
process.exit(0);
