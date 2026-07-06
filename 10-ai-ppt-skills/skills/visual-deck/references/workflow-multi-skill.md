# 方案 Deck 生成：多 Skill 组合工作流

`visual-deck` 只负责「把已经想清楚的内容做成视觉化 PPT」。一份真正能说服客户的方案，**前面还缺两段：叙事骨架 + 素材生产**。这份文档描述从零到交付的完整链路，以及每一段该调哪个 skill。

## 全景链路

```
┌────────────┐   ┌─────────────┐   ┌──────────────┐   ┌──────────────┐   ┌────────────┐
│ 1. 叙事骨架 │ → │ 2. 内容编排  │ → │ 3. 素材生产   │ → │ 4. 渲染成 PPT │ → │ 5. 审计反馈 │
│ office-hrs │   │  visual-deck │   │ nano-banana  │   │ visual-deck  │   │ design-rev │
│ ceo-review │   │ （版式决策）  │   │ pro / svg    │   │  build.js    │   │            │
└────────────┘   └─────────────┘   └──────────────┘   └──────────────┘   └────────────┘
    WHY              WHAT              VISUAL            HOW                QA
```

每一段都可以独立跑，但跳过前面某段就要承担对应的风险——写在每段的"跳过代价"里。

---

## 1. 叙事骨架（WHY） · `/office-hours` + `/plan-ceo-review`

**目的**：在打开 HTML/PPT 之前，先把「为什么要讲这个方案、讲给谁、讲完他们该怎么动」想透。

**做什么**：
- `/office-hours`：六个强制问题——真实需求、最小楔子、具体性、观察证据……逼出故事骨架
- `/plan-ceo-review`：挑战前提，四种模式（EXPANSION / SELECTIVE / HOLD / REDUCTION）定位价值与 scope

**产出**：一份 design doc（`proposal-brief.md`），包含：
- 核心论点（1 句话）
- 客户 3 个主要 pain
- 我们方案的 narrow wedge（最小可感知价值）
- 论证链：问题 → 方案 → 成果 → 落地路径
- 预期页数和章节边界

**跳过代价**：Deck 做完才发现故事线不通，整体返工。我们之前的汽车方案 v5.1 就踩过这个坑。

---

## 2. 内容编排（WHAT） · `visual-deck` 决策树

**目的**：把 `proposal-brief.md` 的每个论点映射到具体的版式，产出 slide HTML。

**做什么**：
- 按 deck 章节拆页，**每页只讲一件事**
- 对照 `SKILL.md` 的「版式决策树」选 layout（cover / quote / stats / timeline / 2col / 3col / r34 / l34）
- 写 HTML，填文字，本地浏览器预览检查 overflow
- 溢出内容**不要缩字号**，放进 `notes-map.js`

**产出**：`slides/slide01.html … slideNN.html` + `notes-map.js` + `image-prompts.md`

**跳过代价**：会陷入"一张图塞 8 条要点"的信息密度失控，或前后三页都是同一个版式的节奏单调。

---

## 3. 素材生产（VISUAL） · `nano-banana-pro` / `svg-logo-designer`

**目的**：按 `image-prompts.md` 批量生产背景图、icon、logo。

**做什么**：

| 素材类型 | 用哪个 skill | 关键约束 |
|---|---|---|
| HF 背景图（封面/章节）| `nano-banana-pro` | V2 四段式 prompt，安全区百分比写死，色彩 token + hex 双写 |
| r34/l34 右图 | `nano-banana-pro` | 3:4 或 1:1 比例，注意右下角留 void |
| 客户/合作方 logo | `svg-logo-designer` 或 直接拿客户素材 | — |
| icon / 抽象图元 | `svg-logo-designer`（pictorial 变体）| — |

**prompt 规范**：见 `references/image-prompts-v2.md`。**不支持 21:9**，需要超宽走 `references/nano-banana-ratios.md` 里的三种变通。

**升级建议**：现有 Nano Banana 对 HF 封面足够，但 r34 小图（304×304pt）用 Pro 的 4K 裁切质量明显更好，下次对比测试一次。

**产出**：`images/slide01.png … slideNN.png`

**跳过代价**：用库存图 / 随便生成会让 deck 失去视觉统一性，客户一眼就能看出"拼凑感"。

---

## 4. 渲染成 PPT（HOW） · `visual-deck build.js`

**目的**：HTML + 图片 + notes → 最终 `.pptx`。

**做什么**：
```bash
cd <deck-project>/
npm install              # 首次
node build.js            # 产出 deck.pptx
```

`build.js` 做的事：
1. `fs.readdirSync('slides/')` 动态枚举所有页（别硬编码页数）
2. playwright 渲染每页 HTML → 调 `html2pptx.js` 转 PPTX 对象
3. 从 `notes-map.js` 注入 speaker notes
4. 写出 `.pptx`

**常见错误**：inline `<span>` 不能有 margin、div 不能用 linear-gradient、body 尺寸必须精确 720×405pt。都在 `SKILL.md` 的"关键陷阱"里。

**产出**：`deck.pptx`

---

## 5. 审计反馈（QA） · `/plan-design-review` 思路

**目的**：交付前自查，过滤"没有叙事目的"的页。

**做什么**（手动逐页过一遍）：
- 这张图在为哪个论点服务？说不清 → 换图或删页
- 这条 bullet 是否只是"看起来专业"的空话（Unlock the power of...）？是 → 删
- 前后三页是不是同一版式？是 → 考虑换 layout 或切镜像
- quote 页是不是超过 3 页？是 → 金句稀释，降级几页为 r34
- 每张 slide 打开速读 5 秒，是否能记住一个具体的东西？

**跳过代价**：交付给客户后才发现有"漂亮但没内容"的页，口头汇报会卡壳。

---

## 速查表：哪段该调哪个 skill

| 阶段 | Skill | 触发时机 |
|---|---|---|
| 1. 叙事骨架 | `/office-hours` → `/plan-ceo-review` | 客户方案启动、还没一行 HTML 时 |
| 2. 内容编排 | `visual-deck`（决策树） | 有了 brief，开始拆页 |
| 3. 素材生产 | `nano-banana-pro` / `svg-logo-designer` | HTML 骨架写完、`image-prompts.md` 出来后 |
| 4. 渲染 PPT | `visual-deck`（build.js） | 图齐了、notes 填了 |
| 5. 审计反馈 | 手动按 `/plan-design-review` 清单自查 | 交付前 |

---

## 最小可行组合

赶时间时允许跳步，但要**自知跳了什么**：

- **最快（1~2h）**：直接 `visual-deck`，故事靠经验脑补，素材用已有图 → 适合内部快速分享
- **标准（半天）**：office-hours → visual-deck → nano-banana 批量跑图 → 自查 → 适合对外方案
- **完整（1~2 天）**：全链路，含 ceo-review 挑战 scope → 适合大客户正式提案、高风险场景

默认走「标准」流程。
