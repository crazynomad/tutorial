# html2pptx 契约 · HTML/CSS 合法子集

> `pipeline/html2pptx.js` 不是浏览器——它把 HTML 逐个转成 PPTX 的 shape/textbox。很多浏览器能渲染的 CSS，它不认。写 slide 前先读这页，能省一堆 build 失败循环。

## 一、硬约束（全部违反 = build 报错）

| # | 约束 | 错误信号（build log） | 正确写法 |
|---|------|--------------------|---------|
| 1 | **不支持 CSS gradient** | `CSS gradients are not supported` | 用 `tools/scrim-bake.js` 把 gradient 烘进 PNG，CSS 里只用 `background: url(scrimmed.png) center/cover no-repeat, var(--bg);` |
| 2 | **inline `<span>` 禁用 `margin-*`** | `Inline element <span> has margin-X` | 改 `padding-*`；或改元素为 `display: block`，放入父 `<p>` |
| 3 | **文本元素不能有 `background` / `border*` / `box-shadow`** | `Text element <p> has background` | 包一层 `<div class="...">`，文本放 `<div>` 里的 `<p>` 中：`<div class="foot"><p>...</p></div>` |
| 4 | **`<div>` 不能直接含裸文本** | `DIV element contains unwrapped text "..."` | 所有文字必须被 `<p>` / `<h1-6>` / `<ul>` / `<ol>` 包住 |
| 5 | **`<p>` 不能以 `*` / `-` / `•` 开头** | `starts with bullet symbol` | 换文字（如 `注 ·`），或用 `<ul><li>...</li></ul>` |
| 6 | **内容必须离 slide 底边 ≥ 0.5" (36pt)** | `overflows body by Xpt vertically` | slide body 高度 405pt，用 `var(--pad-slide)` 保证 36pt 底边，实际正文内容上限 ≈ **327pt 高度** |
| 7 | **`<div>` 的直接子 `<span>` 文字会静默丢失** | **不报错但 PPTX 里文字消失** ⚠️ | 把 `<div class="grid"><span>X</span><span>Y</span></div>` 改成 `<div class="grid"><p>X</p><p>Y</p></div>`，加 `.grid p { margin: 0 }` 保持布局 |
| 8 | **浏览器默认 `<p>` margin 不会被 html2pptx 折叠** | `overflows body by Npt` 集中在多 slide · 本地预览却正常 | 每个 slide `<style>` 开头加全局 reset：`p, h1-h6, ul, ol { margin: 0; padding: 0 }`（详见套路 5c） |

> **规则 7 的危险**：它**不会触发 build 错误**——所以 lint 也抓不到。只有打开 PPTX 才能发现文字消失。受害最典型的是 `display: grid` / `display: flex` 的行容器，把 `<span>` 当作列用。全部改 `<p>` 并重置 margin。

## 二、常见修复套路

### 套路 1：scrim 叠图

❌ 不行：
```css
body {
  background: linear-gradient(rgba(10,10,10,0.7), rgba(10,10,10,0.7)),
              url('bg.png') center/cover no-repeat,
              var(--bg);
}
```

✅ 正确：
```bash
node templates/tools/scrim-bake.js   # 按配置烘 PNG
```
```css
body {
  background: url('bg-scrimmed.png') center/cover no-repeat, var(--bg);
}
```

### 套路 2：带背景的文本块

❌ 不行：
```html
<p class="foot">这是脚注</p>
<style>.foot { background: #14201e; padding: 10pt; }</style>
```

✅ 正确：
```html
<div class="foot"><p>这是脚注</p></div>
<style>.foot { background: #14201e; padding: 10pt; }</style>
```

> 工具：`tools/fix-html-for-pptx.js` 会扫全 slide，自动把带 background/border 的 `<p class="X">` 包成 `<div class="X"><p>...</p></div>`。class 匹配走 token 精确比对，不会误伤 `shot-no` 之类的 `shot-` 前缀类。

### 套路 3：div 里的裸文本

❌ 不行：
```html
<div class="cell-ev">
  <span class="page-ref">P5</span>五层蛋糕   ← "五层蛋糕" 是裸文本
</div>
```

✅ 正确：
```html
<div class="cell-ev">
  <p><span class="page-ref">P5</span> 五层蛋糕</p>
</div>
```

### 套路 4：inline span margin

❌ 不行：
```css
.arrow { margin: 0 10pt; }   /* .arrow 是 <span> */
```

✅ 正确：
```css
.arrow { padding: 0 10pt; }
```

### 套路 5a：div 里只放 span 会悄悄丢字（**最狡猾的坑**）

这条规则 7 的危险在于**不会报错**。build 过，但 PPTX 打开后那个区域空白。

❌ 不行：
```html
<div class="v-row">
  <span class="v-step">STEP 1</span>
  <span class="v-text">需求爆炸 · 三行业 Token 兑现</span>
  <span class="v-tag">TRUE</span>
</div>
```

✅ 正确：
```html
<div class="v-row">
  <p class="v-step">STEP 1</p>
  <p class="v-text">需求爆炸 · 三行业 Token 兑现</p>
  <p class="v-tag">TRUE</p>
</div>
<style>
  .v-row { display: grid; grid-template-columns: 80pt 1fr 36pt; }
  .v-row p { margin: 0; }   /* 关键：重置 p 默认 margin，保持 grid 排版 */
</style>
```

> **典型受害结构**：`display: grid` / `display: flex` 的 row/cell 容器，用 `<span>` 作为网格列。都要改成 `<p>`。

> **检测**：`tools/fix-html-for-pptx.js` 会扫出"直接子节点全是 `<span>` + 文本"的 `<div>` 并自动转 `<p>`。

### 套路 5b：span 里的类有 background / border（5a + 规则 3 组合坑）

**典型场景**：`.tag` / `.chip` / `.box` / `.pill` 这类用 `<span>` 写的 UI "标签"，类定义了 `padding + background + border`。直接对它走 5a（span→p），会立刻触发规则 3（`<p>` 不能有 bg）。

❌ 错误（5a 后的中间状态）：
```html
<div class="tags">
  <p class="tag">AI 原生</p>   <!-- 5a 转完是 p · 但 .tag 有 bg → build 报错 -->
</div>
<style>.tag { padding: 4pt 9pt; background: rgba(...); border: 1pt solid; }</style>
```

✅ 正确（双重转换 · 5a + 规则 2 一起应用）：
```html
<div class="tags">
  <div class="tag"><p>AI 原生</p></div>
</div>
<style>
  .tag { padding: 4pt 9pt; background: rgba(...); border: 1pt solid; }
  .tag p { margin: 0; }
</style>
```

> **自动修复顺序**：`fix-html-for-pptx.js` 现在会在规则 7 产出新的 `<p class="X">` 后 · 再跑一轮规则 3 · 自动把带 bg 的 class 继续包成 div+p。手工写 slide 时若记得这组合坑 · 直接用 div+p 可省一个中间步骤。

### 套路 5c：基线 CSS reset · 防止浏览器默认 margin 塌陷

**陷阱根源**：浏览器对 `<p>` / `<h1-6>` / `<ul>` / `<ol>` 默认有 `margin: 1em 0` 上下外边距 · 在 flex / grid 容器里浏览器会 margin collapse（折叠不可见）· 但 **html2pptx 不做 margin collapse** · 一个 row 里多个 `<p>` 会把每个 `<p>` 的上下 margin 全部累加 · 导致 overflow。

❌ 没 reset：
- 浏览器看 slide 一切正常 · check-overflow 过
- `build --lint` 突然报 `overflows body by Npt vertically` · 50-120pt 都可能

✅ 每个 slide 的 `<style>` 块开头加：
```css
p, h1, h2, h3, h4, h5, h6, ul, ol { margin: 0; padding: 0; }
ul, ol { list-style: none; }
```

> **等价于** 给所有块级文本元素上"margin: 0"基础线 · 在此基础上再按类 / id 覆盖具体间距。几乎所有 slide 模板都应该预置这行。

> **诊断信号**：build 时大量 slide 出现"overflow by 20-60pt"但浏览器预览没问题 → 99% 是这个原因。

### 套路 5：手动 bullet

❌ 不行：
```html
<p class="form-shift">* <span class="accent">注脚</span>：...</p>
```

✅ 正确：
```html
<p class="form-shift">注 · <span class="accent">注脚</span>：...</p>
```

### 套路 6：内容塞得太满

1 吉瓦的内容挤在 405pt × 720pt 里是常见坑。先用 `tools/check-overflow.js` 验证每页 ≤ 540px；接着 `build.js --lint` 验证 36pt 底边。

**压缩优先级**：
1. 砍副标题（subtitle / kicker 删一行 ≈ -25pt）
2. 缩 hero 大字号（120pt → 92pt ≈ -30pt）
3. 缩 padding（14pt → 10pt ≈ -8pt per box）
4. 降 font-size（11pt → 10pt ≈ -1pt per line）——最后手段

## 三、预览 vs Build 的尺寸差

| 标准 | 浏览器 check-overflow | html2pptx build |
|------|---------------------|-----------------|
| body 容器 | 540 px (= 405 pt) | 405 pt |
| 允许内容高度 | ≤ 540 px（body 内不出滚动条） | ≤ **约 504 px / 378 pt**（留 36pt 底边） |

**后果**：`check-overflow.js` 过了，build 不一定过。

**工作流建议**：
```bash
node tools/check-overflow.js    # 快速验证 iframe 没滚动条
node build.js --lint            # 验证所有 pptx 硬约束 + 36pt 底边
node build.js                   # 真正出 pptx
```

## 四、允许但非主流的用法

- **inline `<strong>` / `<em>`**：可以，会被翻成粗体/斜体
- **CSS variables (`var(--x)`)**：解析时会 resolve，可用
- **`<span style="...">`**：支持颜色、font-size、font-weight 等文字级属性
- **嵌套 `<div>`**：支持任意嵌套，但每一层都要遵守"不直接含裸文本"规则

## 五、不会被解析但也不会报错的样式

这些**看起来生效、实则被静默忽略**——preview 里有效果，pptx 里消失：
- `transform` / `rotate` / `scale`
- `::before` / `::after` 伪元素
- `@media` 查询
- CSS animations / transitions
- `filter: drop-shadow` / `backdrop-filter`
- `clip-path` / `mask-image`

> **规则**：如果某个效果 only 通过 `::before` 或 `transform` 实现，pptx 里不会有。要么换成真实元素（加一个 div），要么接受这条效果仅 preview 可见。
