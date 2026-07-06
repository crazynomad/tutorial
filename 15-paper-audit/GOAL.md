# Loop 契约：论文复现审计（Deep Hedging）· 研究审计型

> 形态：探索型的最高阶——路径高度不确定（缺种子/权重/训练态），终点是一份**证据分级的审计台账**。
> 蓝本：OpenAI cookbook「Using Goals in Codex」官方案例（2026-05-09），提示词按六要素+防作弊改造。
> 审计对象口径：**arXiv:1802.03042 v1**（2018-02-08，arXiv 仅此一版；与 Quantitative Finance 2019 发表版可能有差异，台账页码/数值一律以 `paper/` 内 v1 为准）。
> 算力口径：本地笔记本级——路径蒙特卡洛+每步小型前馈网络，单实验分钟级（勿被「量化+神经网络」吓住）。

## 录屏用 /goal（整段粘贴）

```
/goal 复现并审计 Buehler et al.《Deep Hedging》的核心数值主张。流程:先通读 paper/ 目录下的论文材料,建立主张清单(claim inventory,每条含论文原值与出处页码/表号),然后逐条尝试本地复现。完成条件:outputs/audit-report.md 存在,且包含 ①逐条台账(主张/论文值/复现值/差异%/状态),状态只能取四值——精确复现/近似复现/有证据受阻/仍不确定;②每条受阻主张写明缺的是什么(随机种子/权重/训练态等);③关键图表(对冲直方图、成本斜率等)重建为 PNG 存入 outputs/figures/。报告正文用中文,术语可保留英文。规矩:①只准依据论文自行实现,禁止使用任何现成的 deep-hedging 实现库(torch/numpy 等通用框架可用);②全部训练在本机跑,单次训练 wall-clock 不超过 15 分钟,超时主张降级为近似或受阻,不许静默加大算力;③台账中的论文原值必须标注页码/表号,禁止编造;④每轮结束把台账最新状态贴到对话里作为证据。若无合法路径推进,停止并报告已试路径、已获证据、阻塞点和解锁所需输入。or stop after 40 turns.
```

## 与官方原版的差异（六要素改造对照）

| 要素 | 官方原版 | 本版 |
|---|---|---|
| Outcome | "strongest reproduction"（抽象） | 指定产物：`outputs/audit-report.md` 四态台账 + `outputs/figures/` 重建图 |
| Verification | "verify the outputs" | 逐条对照论文原值，差异%入表，**原值必须带页码/表号**（防编造论文数字） |
| Constraints | 无 | **禁现成 deep-hedging 实现库**（搬运≠复现）；单训练 ≤15min（防静默堆算力） |
| Boundaries | "local resources" | 材料限 `paper/`，训练限本机 |
| Iteration policy | 无 | 每轮贴台账最新状态（/goal 判官只认对话内证据） |
| Blocked 终态 | 有（保留） | 加码：受阻必须写明缺的具体是什么 |

镜头设计：报告中文（台账直接上屏）；图表 PNG（对冲直方图 + 红黄绿台账 = 现成 b-roll，接 cookbook fig6 视觉语言）。

## 通俗口播雏形

「华尔街教神经网络学会了给期权做对冲，论文里报了一串数。我们让 AI 把论文从头读一遍、代码从零写一遍、把那串数一个一个对出来——对不上的，它得告诉我为什么。」

## 目录

```
paper/deep-hedging-1802.03042.pdf   # arXiv v1 原文（审计唯一依据）
paper/deep-hedging-1802.03042.txt   # pdftotext 便查副本
outputs/                             # loop 产出（运行时生成，不预置）
```

## 状态

- 2026-07-06 材料就绪（论文 v1 已核对正主：Buehler/Gonon/Teichmann/Wood）。**第 0 轮验证未跑**——待择时开跑（周末级：验证台账质量、总时长、单实验是否真在 15 分钟内）。
- 归属：ep15 候选「AI 研究员」（AutoResearch 跑实验 × 研究审计查主张）；EP14 至多口述带过官方案例。
