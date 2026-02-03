# Mac 磁盘瘦身完整攻略：3 个 Skills 释放 120G 空间

## Overview
用 Claude Code + 3 个免费 Skills，0 代码完成 Mac 磁盘清理、文件整理、文档知识库构建。一句话就能调用大神的开源工具。

## Learning Objectives
1. 掌握"瘦身 → 收纳 → 提炼"三阶段完整工作流
2. 理解每个 Skill 背后的核心技术和安全机制
3. 知道如何安装 Claude Code、获取 Skills、以及免费替代方案

---

## Section 1: 全局概览 — 三阶段工作流

**Key Concept**: 三个 Skills 串联成"瘦身 → 收纳 → 提炼"一条龙工作流

**Content**:
- **阶段一 瘦身** disk-cleaner：清理系统缓存垃圾 → 释放 106G
- **阶段二 收纳** file-organizer：整理下载文件夹 → 释放 11G+
- **阶段三 提炼** doc-mindmap：PPT/PDF → 个人知识库
- 总计释放 120G 磁盘空间
- 全程 0 代码，会打字就行

**Visual Element**: 三步流程箭头图，每步标注 Skill 名 + 核心动作 + 产出

**Text Labels**:
- Headline: "瘦身 → 收纳 → 提炼"
- Labels: "disk-cleaner 释放106G", "file-organizer 释放11G+", "doc-mindmap 个人知识库"

---

## Section 2: 阶段一 — 磁盘瘦身 (disk-cleaner)

**Key Concept**: 基于 Mole 的智能磁盘清理，5 个选项保障安全

**Content**:
- 核心引擎：tw93 开发的 Mole（GitHub 3万+ stars）
- 扫描结果分类：用户应用缓存 ~80G、浏览器缓存 37G、系统日志 22G
- 5 个操作选项：
  - 3 个清理档位（轻度/推荐Pro/深度）
  - 生成完整 CSV 清单（桌面可查）
  - 配置白名单（办公/开发者/媒体三种预设模板）
- 安全机制：白名单保护 Documents 和 Desktop，清理前二次确认
- 实际效果：31G 可用 → 137G 可用，释放 106G

**Visual Element**: 清理流程卡片 + 数据对比条形图

**Text Labels**:
- Headline: "阶段一：磁盘瘦身"
- Subhead: "Mole — tw93 开源 | GitHub 3万+ Stars"
- Labels: "应用缓存 ~80G", "浏览器缓存 37G", "系统日志 22G", "31G → 137G"

---

## Section 3: 阶段二 — 文件收纳 (file-organizer)

**Key Concept**: 利用 macOS 原生能力智能整理下载文件夹

**Content**:
- 底层能力：macOS 自带的 Finder 智能文件夹 + 文件元数据 + Spotlight 索引
- 扫描结果：1,600+ 文件，办公文档最多，图片 300+，还有音视频
- 两种整理模式：
  - 手动模式：桌面创建智能文件夹（只是视图，不移动原文件）
  - 自动模式：预览后批量整理
- 智慧建议：保留办公文档，自动清除音视频文件
- 实际效果：删除 171 个音视频文件，释放 11G+

**Visual Element**: 文件分类扇形/柱状 + 双模式对比

**Text Labels**:
- Headline: "阶段二：文件收纳"
- Subhead: "macOS 原生能力 | 智能文件夹 + Spotlight"
- Labels: "1,600+ 文件", "手动模式", "自动模式", "171个文件 → 释放11G+"

---

## Section 4: 阶段三 — 文档提炼 (doc-mindmap)

**Key Concept**: 四步流程把 PPT/PDF 变成可检索的个人知识库

**Content**:
- 困扰：4,000+ 份 PPT、14,000+ 份 PDF，无人有时间逐一打开分类
- 四步自动流程：
  1. 转格式：MarkItDown（微软开源）→ PPT/PDF 转 Markdown 纯文本
  2. 提摘要：Ollama + 千问 3B 本地模型 → 每份文档生成摘要（完全本地，不上传）
  3. 智能分类：三维度（按主题 / 按用途 / 按客户）
  4. 归档输出：分类文件夹 + AI 摘要 + 思维导图
- 附加能力：发现 3 组重复文件自动删除、建议优化文件名
- 产出：不需要 Notion/Obsidian，普通文件夹 + 纯文本 = 永不过时的知识库

**Visual Element**: 四步流水线图 + 三维分类示意

**Text Labels**:
- Headline: "阶段三：文档提炼"
- Subhead: "MarkItDown + Ollama + 智能分类"
- Labels: "转格式", "提摘要", "分类", "归档", "按主题", "按用途", "按客户"

---

## Section 5: Claude Code vs 网页版 Claude

**Key Concept**: 三个核心区别说明为什么要用 Claude Code

**Content**:
- 区别一 记忆：网页版每次新对话"失忆"；Claude Code 运行在本地，文件即上下文
- 区别二 行动：网页版只能"建议你手动操作"(Talking)；Claude Code 直接帮你执行删除 106G (Doing)
- 区别三 扩展：Claude Code = AI 操作系统，每装一个 Skills = 打一个升级补丁
- 延伸：OpenClaw（原 Clawbot，GitHub 10万+ stars）背后核心也是 Claude Code，更激进（接管屏幕鼠标），Claude Code + Skills 是同一路线更稳可控的玩法

**Visual Element**: 三行对比表

**Text Labels**:
- Headline: "为什么用 Claude Code？"
- Labels: "失忆 vs 记忆", "动嘴 vs 动手", "单次对话 vs AI 操作系统"

---

## Section 6: 安装与资源

**Key Concept**: 手把手安装 + 资源大全

**Content**:
- 安装 Claude Code：
  1. 官网复制安装命令 → 终端粘贴 → 等待完成
  2. 重启终端 → 选主题 → 浏览器登录授权
  3. Claude Code = 通用 Agent（天才实习生），Skills = 知识胶囊
- 安装 Skills：
  - 终端跟 Claude 说"帮我看看 GitHub 仓库怎么装" + 粘贴链接
  - Claude 自动读取、自动安装、遇错自动修复
- Skills 来源：
  - 本期 GitHub 仓库（3 个 Skills 免费）
  - Anthropic 官方 Skills 市场（通过认证）
  - Vercel skills.sh（带安装量排名）
- 免费替代方案：
  - Open Code：完全开源免费，社区驱动
  - Google Gemini CLI：内置 Skills 支持
- 背后开源工具：
  - Mole (tw93) — github.com/tw93/Mole
  - MarkItDown (Microsoft)
  - Ollama — ollama.com

**Visual Element**: 安装步骤流程 + 资源链接卡片

**Text Labels**:
- Headline: "安装与资源大全"
- Labels: "Claude Code 安装", "Skills 安装", "Anthropic 市场", "skills.sh", "Open Code", "Gemini CLI"

---

## Data Points (Verbatim)
- "释放120G的硬盘空间"
- "用户应用缓存将近80个G"
- "浏览器缓存37个G"
- "系统日志22个G"
- "清理之前只剩31个G可以用"
- "变成了137个G"
- "足足释放了106个G磁盘空间可用"
- "1,600多个文件"
- "图片也有300多个"
- "171个音视频文件被删除了"
- "又多了十一点几个G的空间"
- "一共释放了120个G的磁盘空间"
- "使我的电脑上有4,000多份PPT"
- "14,000多份PDF"
- "GitHub上有3万多星的开源项目" (Mole)
- "GitHub上几天就到了10万多stars" (OpenClaw)
- "MacBook升级一体硬盘要3,000块钱"
- "28个PPT的摘要全部生成完毕"

---

## Design Instructions
- "游戏攻略"风格：信息密集但结构清晰
- 面向非程序员观众
- 中文为主
