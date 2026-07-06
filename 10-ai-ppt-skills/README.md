# EP10 · AI 做 PPT 全流程 · Skills + 教程

> 配套视频：[绿皮火车 EP10](https://youtu.be/{EP10_VIDEO_ID})  ·  时长 24:04
> NVIDIA 护城河完整案例 deck（34 页）：[examples/nvidia-moat/](./examples/nvidia-moat/)

## 一句话总结

**做专业 PPT 不是「一键生成」，是「研究 → 分析 → 表达」三幕式协作**。这个仓库给你三个 Claude Skills + 一个开源 visual-deck Skill，帮你把传统几天的工作压到一上午。

---

## 🚀 一键安装

```bash
curl -fsSL https://raw.githubusercontent.com/crazynomad/tutorial/main/10-ai-ppt-skills/install.sh | bash
```

或手动安装：

```bash
git clone https://github.com/crazynomad/tutorial.git
cp -r tutorial/10-ai-ppt-skills/skills/* ~/.claude/skills/
```

安装后**重启 Claude Code**，输入 `/ppt-classify` 即可启动。

---

## 📦 四个 Skills

| Skill | 职责 | 视频时间戳 |
|---|---|---|
| [`ppt-classify`](./skills/ppt-classify/SKILL.md) | 判定 PPT 类型（立论 / 研究 / 教学 / 叙事），给出对应章节骨架 | 05:40 - 08:50 |
| [`ppt-research-setup`](./skills/ppt-research-setup/SKILL.md) | 把骨架填进证据，建立"先不反驳"的对方论证链 | 08:50 - 11:30 |
| [`ppt-narrative-review`](./skills/ppt-narrative-review/SKILL.md) | 像放大镜：找出叙事张力问题、标出事实核查点（不替你下结论） | 11:30 - 19:00 |
| [`visual-deck`](./skills/visual-deck/SKILL.md) | HTML → PPTX 视觉表达 · 含 templates / pipeline / references | 21:00 - 22:30 |

---

## 📚 完整工作流（五步）

```
Step 1 · 研究        NotebookLM + Deep Research
                   ↓
Step 2.1 · 定调       /ppt-classify        ← 选 PPT 类型，避免用错框架
                   ↓
Step 2.2 · 填证据     /ppt-research-setup  ← 用 NotebookLM evidence 喂 Skills
                   ↓
Step 2.3 · 审论述     /ppt-narrative-review ← 多轮 review + 事实核查
                   ↓
Step 3 · 视觉化      /visual-deck  或  Claude Design 网站
```

详细每步的输入/输出 + 踩坑：见 [TUTORIAL.md](./TUTORIAL.md)

---

## 🎯 NVIDIA 护城河案例

EP10 视频里完整跑了一遍五步流程，产出 34 页研究型 PPT。所有产物在 [examples/nvidia-moat/](./examples/nvidia-moat/)：

```
examples/nvidia-moat/
├── 01-classify-output.md      # ppt-classify 给的 6 章骨架
├── 02-evidence.md             # NotebookLM 拉的证据池
├── 03-research-output.md      # ppt-research-setup 填好的论证链
├── 04-review-round1.md        # 第一轮 review · 4 条张力 + 11 条核查
├── 05-review-round2.md        # 第二轮 review · 评分 7 → 9
├── 06-final-deck.pdf          # 最终 34 页 PDF
└── 07-screenshots/            # 关键截图
```

---

## ❓ FAQ

**Q: 这些 Skills 跟一键 PPT 工具（Gamma / Canva）有什么区别？**

A: 一键工具替你做决策，Skills 把决策扔回给你 —— 它只帮你执行。专业方案的"专业"两个字就在这些决策里。

**Q: 我没用过 Claude Code 怎么办？**

A: 看 [EP08 微信×Claude Code](https://youtu.be/-xCZ9KtaC04) · Claude Code 入门，~10 分钟。

**Q: 必须装 NotebookLM 吗？**

A: 强烈推荐。它是反幻觉防线 + 视频源处理杀手锏。看 [EP01 NotebookLM](https://youtu.be/{EP01_VIDEO_ID})。

**Q: visual-deck 和 Claude Design 怎么选？**

A: Claude Design 内测限流 + 全在 web 端；visual-deck 开源 + 完全本地可控 + 适合需要版本管理的场合。视频里 22:30 段有完整对比。

---

## 🔗 相关链接

- 📺 视频：YouTube [绿皮火车](https://www.youtube.com/@greentrainpodcast) · [B站](https://space.bilibili.com/565619114)
- 🤖 Claude Code: https://claude.ai/code
- 🎨 Claude Design（内测）: https://claude.ai/design
- 📚 NotebookLM: https://notebooklm.google.com
- ⭐ gstack（Garry Tan 开源 · 启发了我这套 Skills）: https://github.com/garrytan/gstack

---

## License

MIT · 欢迎 fork、改、用在你自己的工作流里。如果对你有帮助欢迎到视频下留言告诉我你做的是哪种 PPT 😄
