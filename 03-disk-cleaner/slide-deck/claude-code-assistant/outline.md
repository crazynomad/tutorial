# Slide Deck Outline

**Topic**: Claude Code 智能工作助理实施策划案
**Style**: notion
**Audience**: 产品经理、分析师、非技术人员
**Language**: 中文 (zh)
**Slide Count**: 10 slides
**Generated**: 2026-01-23 15:30

---

<STYLE_INSTRUCTIONS>
Design Aesthetic: Clean, functional SaaS interface aesthetic. Dashboard-inspired layouts with clear data hierarchy. Notion, Linear, and modern productivity tool styling. Information-dense but organized. Professional and trustworthy.

Background:
  Color: Light Gray (#F7F7F5)
  Texture: None - clean solid backgrounds

Typography:
  Primary Font: Modern system UI sans-serif, semi-bold weight, clean functional letterforms, slightly tighter letter-spacing
  Secondary Font: Same family in regular weight, optimized for screen reading, comfortable line height

Color Palette:
  Primary Text: Near Black (#1F1F1F) - Headlines, body
  Background: Light Gray (#F7F7F5) - Primary background
  Card Background: Pure White (#FFFFFF) - Content cards
  Accent 1: Notion Blue (#2383E2) - Links, primary actions
  Accent 2: Success Green (#0F7B6C) - Positive metrics
  Accent 3: Alert Red (#E03E3E) - Negative metrics

Visual Elements:
  - Card-based layouts with subtle borders or shadows
  - Clean data tables and comparison charts
  - Progress bars and metric displays
  - Icon-based navigation hints
  - Tag and label chips for categories
  - Checkbox and toggle styling for features

Style Rules:
  Do: Use card-based content organization, create clear data hierarchy, use subtle shadows and borders, keep layouts grid-aligned, present metrics prominently
  Don't: Use decorative illustrations, add gradients or complex backgrounds, create artistic layouts, use rounded blob shapes, add slide numbers or logos
</STYLE_INSTRUCTIONS>

---

## Slide 1 of 10

**Type**: Cover
**Filename**: 01-slide-cover.png

// NARRATIVE GOAL
Set the stage for a productivity transformation story - establish that this is about AI-powered work efficiency

// KEY CONTENT
Headline: Claude Code 智能工作助理
Sub-headline: 让 AI 成为你的高级实习生

// VISUAL
Clean SaaS-style cover with a central dashboard mockup showing AI agent interface. Terminal window icon combined with document icons suggesting file system access. Subtle grid pattern in background.

// LAYOUT
Centered composition with headline in bold near-black text. Sub-headline below in lighter gray. Abstract dashboard visualization in lower half. Notion-blue accent line separating title from visual.

---

## Slide 2 of 10

**Type**: Content
**Filename**: 02-slide-pain-point.png

// NARRATIVE GOAL
Create emotional resonance by articulating the universal pain of repetitive information work

// KEY CONTENT
Headline: 你是否深陷"复制粘贴地狱"？
Sub-headline: 低价值重复劳动正在消耗你的深度思考时间
Body:
- 打开网页 → 复制信息 → 粘贴文档 → 整理格式
- 每次对话都要重新"喂"资料给 AI
- 信息碎片化，上下文不断丢失

// VISUAL
Card-based layout showing a workflow diagram with repeating loop arrows. Multiple browser windows and document icons in a chaotic arrangement. Red accent highlighting the pain points.

// LAYOUT
Left side: headline and pain points in stacked cards. Right side: visual workflow diagram showing the repetitive cycle. Use Alert Red sparingly for emphasis.

---

## Slide 3 of 10

**Type**: Content
**Filename**: 03-slide-solution.png

// NARRATIVE GOAL
Introduce Claude Code as the breakthrough solution with a clear value proposition

// KEY CONTENT
Headline: 解决方案：本地化 AI 智能体
Sub-headline: Claude Code 不只是代码工具，它是你的文件系统 AI Agent
Body:
- 运行在终端（Terminal）中
- 直接操作本地文件系统
- 像高级实习生一样自动执行任务

// VISUAL
Clean terminal window interface mockup showing Claude Code in action. File tree structure on one side, AI response on another. Blue accent highlighting the "AI Agent" concept.

// LAYOUT
Central card showing terminal interface. Surrounding smaller cards indicating capabilities. Notion Blue used for interactive/active elements.

---

## Slide 4 of 10

**Type**: Content
**Filename**: 04-slide-core-advantages.png

// NARRATIVE GOAL
Present the three key differentiators that make Claude Code uniquely valuable

// KEY CONTENT
Headline: 三大核心优势
Sub-headline: 为什么 Claude Code 与众不同
Body:
- 📁 本地文件读写：直接读取 PDF、Markdown，无需手动上传
- 🧠 持久化记忆：CLAUDE.md 建立项目记忆，无需重复交代
- 📋 自主任务规划：Plan Mode 先拆解再执行

// VISUAL
Three horizontal cards stacked vertically, each representing one advantage. Icons on the left of each card. Clean data table styling with subtle borders.

// LAYOUT
Vertical stack of three feature cards with consistent spacing. Each card has icon, title, and brief description. Notion Blue accents on icons.

---

## Slide 5 of 10

**Type**: Content
**Filename**: 05-slide-comparison.png

// NARRATIVE GOAL
Demonstrate concrete value through direct workflow comparison

// KEY CONTENT
Headline: 传统方式 vs Claude Code
Sub-headline: 以"季度竞品分析"为例的工作流对比
Body:
- 信息收集：手动 5 个网站 → 一条指令自动抓取
- 数据整理：手动调格式 → 自动生成结构化 Markdown
- 对比分析：人工核对 → 自动生成对比表格
- 持续更新：重复所有步骤 → 增量自动更新

// VISUAL
Two-column comparison table with clear visual distinction. Left column (traditional) in muted gray, right column (Claude Code) highlighted with green success indicators.

// LAYOUT
Full-width comparison table card. Traditional workflow items with gray checkboxes, Claude Code items with green success checkmarks. Clear column headers.

---

## Slide 6 of 10

**Type**: Content
**Filename**: 06-slide-phase1.png

// NARRATIVE GOAL
Provide actionable first step for implementation

// KEY CONTENT
Headline: 第一阶段：环境搭建
Sub-headline: Setup - 10 分钟完成基础配置
Body:
- 步骤 1：终端运行安装命令（Mac/Windows 均支持）
- 步骤 2：授权 Claude 访问工作文件夹
- 步骤 3：创建 CLAUDE.md 建立"大脑"
- 示例："你是资深市场分析师，输出使用 Markdown 表格..."

// VISUAL
Step-by-step checklist card with numbered items. Code snippet card showing CLAUDE.md example content. Progress indicator showing Phase 1 of 3.

// LAYOUT
Left: numbered checklist with checkboxes. Right: code/config preview card. Top progress bar showing current phase highlighted.

---

## Slide 7 of 10

**Type**: Content
**Filename**: 07-slide-phase2.png

// NARRATIVE GOAL
Show how to create custom automation commands

// KEY CONTENT
Headline: 第二阶段：构建指令
Sub-headline: Slash Commands - 定义你的专属自动化流程
Body:
- 创建自定义指令：如 `/update-competitors`
- 定义 Agent 行为序列：
  - 读取 competitors.md 列表
  - 联网搜索最新主页
  - 更新各自的 .md 文件
  - 生成 comparison_table.md

// VISUAL
Command flow diagram showing slash command triggering a series of automated actions. Cards connected by flow arrows. Terminal command prompt styling.

// LAYOUT
Central workflow diagram with command input at top, cascading action cards below. Progress bar showing Phase 2 highlighted.

---

## Slide 8 of 10

**Type**: Content
**Filename**: 08-slide-phase3.png

// NARRATIVE GOAL
Paint a picture of the transformed daily workflow

// KEY CONTENT
Headline: 第三阶段：日常使用
Sub-headline: Daily Workflow - AI 成为你的工作伙伴
Body:
- 🌅 早晨：运行 `/today`，自动生成今日日报
  - 检查待办、搜索行业新闻、整理 GitHub/Jira 更新
- 💼 工作中：自然语言输入任务
  - "分析 [新产品] 的优劣势，对比我们的产品"
  - Claude 直接修改本地分析文档

// VISUAL
Day timeline showing morning and workday scenarios. Calendar/clock icons. Chat-like interface showing natural language commands. Document icons showing file updates.

// LAYOUT
Two horizontal sections: Morning workflow card on top, Workday workflow card below. Each with timeline indicator and action examples.

---

## Slide 9 of 10

**Type**: Content
**Filename**: 09-slide-roi.png

// NARRATIVE GOAL
Quantify the benefits to drive decision-making

// KEY CONTENT
Headline: 预期收益 ROI
Sub-headline: 三个维度的价值提升
Body:
- ⚡ 效率提升：数小时 → 几分钟
- 📚 知识沉淀：对话框 → 结构化文档库
- 🎯 心流保护：多窗口切换 → 单一终端界面

// VISUAL
Three metric cards showing before/after comparisons. Progress bars or gauge charts indicating improvement. Green success color for positive metrics.

// LAYOUT
Three equal-width metric cards in a row. Each card shows metric name, before state, arrow, after state. Green accent for improvement indicators.

---

## Slide 10 of 10

**Type**: Back Cover
**Filename**: 10-slide-back-cover.png

// NARRATIVE GOAL
Inspire action with a memorable closing and clear next step

// KEY CONTENT
Headline: Vibe Coding
Sub-headline: 不需要懂代码，只需要描述你的工作流
Body:
- 下一步建议：
- 从"个人知识库助理"开始
- 将笔记文件夹交给 Claude Code 管理
- 建立对 AI 队友的信任感

// VISUAL
Clean closing card with inspirational tagline. Abstract visualization of natural language transforming into automated workflow. Notion Blue accent for call-to-action.

// LAYOUT
Centered headline in large bold text. Sub-headline below. Action items in a clean card at bottom. Minimalist design with ample whitespace.
