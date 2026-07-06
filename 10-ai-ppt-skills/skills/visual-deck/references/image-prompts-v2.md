# Image Prompt V2 · 四段式契约

> 所有图像 prompt 必须遵守此格式。缺段 / 缺 hex / 缺 "Do not include" 都会导致生成失败或污染。

## 四段结构

```
1. 描述（主体 + 动作 + 光影）
2. Composition（比例 + 主体位置 + 安全区%）
3. Style（镜头 + 用光 + 色调 + 氛围）
4. Aspect ratio + Do not include（排除项）
```

## 模板（HF · 16:9 全幅）

```
A horizontal composition. [主体描述，用动词推动画面，明确光影关系]. [关键细节 1]. [关键细节 2]. The [focal element] is the visual focal point. [Rim/Fill light description].

Composition: 16:9 landscape orientation (1920 by 1080). [主体占幅]，occupying the central X% of the frame width and Y% of the frame height. [次要元素位置]. All four edges have generous void fade. This image will have a 62% opacity dark scrim overlay in deployment, so moderate detail density is acceptable.

Style: cinematic studio photography, [焦距] equivalent, [主光方向], [副光方向], deep void background (color: void black, hex #0A0A0A), Apple keynote minimalism, mood of [情绪词].

Aspect ratio: 16:9 landscape.

Do not include: any text, letters, numbers, logos, watermarks. [排除 3~5 个最容易被 AI 误加的元素]. No white background, no daylight, no AI artifacts.
```

## 模板（R34 / L34 · 3:4 竖图）

```
A vertical composition. [主体描述，主体必须在画面中上部，底部留白]. [关键细节]. [Rim light description].

Composition: vertical 3:4 portrait orientation (768 by 1024). [主体] in the upper 40% of the frame, centered horizontally. [次要元素] in the lower 30%. **Top 15% and bottom 15% of the frame fade to pure void black for safe cropping**. [光源方向].

Style: cinematic [photography type], [焦距] equivalent, [景深描述], deep void background (color: void black, hex #0A0A0A), Apple keynote minimalism, mood of [情绪词].

Aspect ratio: 3:4 vertical portrait.

Do not include: any text, letters, numbers, logos, watermarks. [排除项]. No white background, no daylight, no AI artifacts.
```

## 色彩 Token（双写：名字 + hex）

永远这样写：`warm coral, hex #FF6B47` —— 只写 token 或只写 hex 都会漂色。

**默认暗色 CORAL 系（推荐）**
- 主：`warm coral, hex #FF6B47`
- 副：`warm gold, hex #D4A574`
- 底：`void black, hex #0A0A0A`

**暗色 TEAL 系（用于技术章节/冷静段落）**
- 主：`cool teal, hex #76C7C0`
- 副：`warm gold, hex #D4A574`
- 底：`void black, hex #0A0A0A`

切色系时**只改 prompt 里的 hex**，pipeline 和 HTML 都不动（或同步改 HTML 的 accent 色）。

## "Do not include" 必选项

**永远要排除**（AI 会自动加）：
- `any text, letters, numbers, logos, watermarks`
- `AI artifacts`（多指 / 变形 / 模糊畸变）
- `white background, daylight`（暗色 deck 的大敌）

**按主题追加**：
- 场景是工业 → `no workers, no human hands, no faces`（除非主体是人）
- 场景是数据 → `no charts, no graphs, no UI mockups, no dashboards`
- 场景是城市 → `no specific city landmarks, no recognizable brands`

## 常见坑

- ❌ **比例写 "landscape"** 但没写 "16:9" → Nano Banana 会给你 3:2
- ❌ **用 "orange" 代替 "warm coral, hex #FF6B47"** → 每次颜色都不一样
- ❌ **安全区写 "some space at top"** → 必须写死百分比："top 15% fade to void"
- ❌ **Do not include 写 "no text"** → 要写 "any text, letters, numbers, logos, watermarks"（覆盖完整）

## 交付格式

输出到 `image-prompts.md`，每张图一个 section，带复用表：

```markdown
| 图像文件 | 用于 slide | Layout | 比例 | 色系 |
|---|---|---|---|---|
| slide01.png | 01, 28 | HF | 16:9 | CORAL |
...

## slide01.png · [一句主旨] · 16:9 HF

\`\`\`
[四段式 prompt]
\`\`\`
```
