---
name: ppt-classify
description: Classify a PPT brief into one of four types (Pitch / Research / Teaching / Narrative), then emit a high-level chapter skeleton for that type personalized to the topic. Different PPT types need different立论 frameworks AND different chapter structures — a research PPT is not a pitch, a pitch is not a narrative. Use at the very start of PPT planning, BEFORE thesis setup. Pairs with ppt-research-setup / other per-type setup skills for detailed per-chapter reasoning.
version: 0.2.0
---

# ppt-classify — PPT 类型分类 + 章节骨架 + 立论路由

## 何时触发

**适用**：
- 用户描述了一个 PPT 任务（"帮我做一份 xxx 的 PPT"）但还没定立论方式
- 用户在动手做 PPT 之前，想先想清楚**整体架构**
- 团队讨论 PPT 方向时需要对齐"这是在做什么类型的表达"+"整体多少章"

**不适用**：
- 已经明确是某一类 PPT + 章节已定 → 直接用对应立论 skill 深入每章
- 纯数据报告 / 纯文字文档 → 不是 PPT 的问题，换格式

## 核心洞察：分类 + 骨架 = Step 0

做 PPT 的第一个错误不是选错模板，是**没分清你在做哪种 PPT、也没想过整体骨架**。

四种 PPT 的立论方式**完全不同**，对应的**章节骨架**也完全不同：

| 类型 | 核心意图 | 立论方式 | 典型骨架形态 | 典型场景 |
|------|---------|---------|-----------|---------|
| **Pitch / Proposal** | 说服观众接受某判断 | 抛观点 → 捍卫 | 痛点 → 方案 → 证据 → 路径 → CTA | 融资 / 立项 / 方案 / 汇报结论 |
| **Research / Investigation** | 带观众走一遍调查 | 提问题 → 设计路径 → 推结论 | 悖论 → 被研究对象论证 → 多条检验路径 → 综合 | 行业分析 / 竞品研究 / 投资 |
| **Teaching / How-to** | 教观众做某事 | 明确目标能力 → 拆步骤 | 目标 → 前置 → 分步 → 验证 → 延伸 | 培训 / 教程 / 方法论普及 |
| **Narrative / Storytelling** | 讲一个故事 | 主角 + 冲突 + 转折 | 开场 → 冲突 → 对抗 → 突破 → 余韵 | 复盘 / 品牌故事 / 案例分享 |

用 pitch 的方式做 research PPT → 你会变成鼓吹者。
用 research 的骨架做 pitch PPT → 观众听完不知道你想让他们做什么。
用 narrative 的骨架做 teaching PPT → 观众被故事打动但什么也没学会。

## 诊断流程

逐层分层问（按顺序问，前一问命中就停止）：

### Q1：这个 PPT 要让观众做出某个决策吗？

- **是** → 极可能是 **Pitch**（融资、产品立项、方案批准都是决策驱动）
  - 进一步确认：结论是否已经定了？你在捍卫一个判断？→ Pitch 确认
  - 如果结论还没定，只是"想让观众参与决策" → 可能是 Research
- **否** → 继续 Q2

### Q2：观众听完 PPT 需要会做某件具体的事吗？

- **是**（能独立复现某个操作、应用某个方法） → **Teaching**
- **否** → 继续 Q3

### Q3：核心驱动力是"具体事件经过"还是"抽象论证"？

- **事件经过**（有主角、有时间线、有情感弧线） → **Narrative**
- **抽象论证**（有框架、有证据链、有维度分析） → **Research**

### Q4：边界情况

- **混合型**：标注主类型 + 次类型。主类型决定立论 skill + 骨架形态，次类型决定辅助手法
- **用户不确定**：列出最像的两类，描述各自的立论后果 + 骨架差异，让用户选
- **根本不该做 PPT**：如纯数据查询、纯 FAQ → 建议换格式

## 输出格式 · v0.2.0 新增「章节骨架建议」

完成诊断后，输出如下结构（**必须包含四个 section**）：

```
【PPT 类型判定】
主类型：Research
次类型：（无 / 或注明）
判定依据：用户想带观众走一遍"NVIDIA 护城河是否削弱"的调查，
          结论不预设，观点在多条路径汇合后产生。

【推荐立论 skill】
主路径：ppt-research-setup（研究型三段式 + specificity 诊断 +
        本 skill 输出的章节骨架作为输入）
辅助：完成后可用 ppt-narrative-review 做张力审稿

【章节骨架建议】
研究型典型骨架（已针对"NVIDIA 护城河"personalize）：
  章 1 · 反共识悖论     | 翻倍悖论：$500B → $1T · 21 个月
  章 2 · 被研究对象论证 | Jensen 的四步推理链（需求 / Token / TCO / 资金）
  章 3 · 检验路径 1     | 需求真爆炸？三行业 Token 落地 + 物理极限
  章 4 · 检验路径 2     | Token 经济 + NVIDIA 身份换皮
  章 5 · 检验路径 3     | TCO 护城河 + 中国替代链威胁
  章 6 · 综合判决       | 四步结论 + 3 个重估信号

建议章节数：5-7 章（研究型的适配范围）
建议单集长度：如 5 min 视频配套，每章约 30-60 秒；如 20 min 深度，可扩到每章 2-3 分钟

【下一步】
运行 ppt-research-setup，把上面的章节骨架传入，让它把每章填成
具体的推理链 + 证据锚点。
```

## 四类型的规范骨架（reference）

这是 skill 内部查表用的 canonical skeleton，**personalize 时按具体题目替换章标题**：

### Pitch / Proposal（5-7 章）
1. **痛点 / 现状**（观众为什么该关心）
2. **解决方案**（我们提出什么）
3. **为什么是我们**（差异化 / 团队 / 资产）
4. **牵引力 / 证据**（用户 / 订单 / 实验数据）
5. **商业模式 / 路径**（钱从哪来 / 怎么 scale）
6. **（可选）风险缓释**
7. **CTA / Ask**（观众走出会议时要做什么）

### Research / Investigation（5-7 章）
1. **反共识悖论**（研究动机：为什么这个问题不是显然的）
2. **被研究对象的论证**（先完整说清，不急着反驳）
3-5. **检验路径 1/2/3**（每条独立、可验证、能推出证据）
6. **综合判决 + 监测框架**（结论 + 未来重审信号）

### Teaching / How-to（4-6 章）
1. **学完能做什么**（目标能力 / 验收标准）
2. **前置条件**（你需要哪些基础 / 准备什么工具）
3-5. **Step-by-step**（可按复杂度拆成 2-4 章）
6. **常见陷阱 + 如何验证 + 延伸学习**

### Narrative / Storytelling（5 章 · 三幕式）
1. **开场**：主角 + 世界设定
2. **转折 1**：冲突 / 触发事件
3. **中段**：对抗升级 / 代价
4. **转折 2**：突破 / 顿悟 / 关键决策
5. **结尾**：新常态 + 余韵 / 启示

## Personalize 规则

**不要直接吐上面的 canonical skeleton 原文**。按用户的具体题目：
1. 识别题目里的关键概念（如 "NVIDIA 护城河"、"Claude Code 教程"）
2. 把 canonical 骨架的抽象 slot 填成具体章节标题
3. 检查章节数是否匹配用户的时长预期
4. 如果混合型（主 X + 次 Y），在骨架里嵌入 1-2 个次类型的章节（例：主 Research + 次 Narrative → 在某一条检验路径里加一个"关键个案"子章）

## 快速参考：四类常见场景映射

| 用户描述 | 判定 | 骨架示例 |
|---------|------|---------|
| "帮我做融资 PPT" | Pitch | 痛点 → 方案 → 牵引 → 钱 → CTA |
| "帮我做一份 xx 行业的调研 PPT" | Research | 悖论 → 对象论证 → 3 检验 → 综合 |
| "帮我做一份 xx 产品的使用教程" | Teaching | 目标 → 前置 → 3 步骤 → 验证 |
| "帮我做一份项目复盘 PPT" | Narrative | 开场 → 冲突 → 对抗 → 突破 → 余韵 |
| "帮我做 PPT 汇报本季度 KPI" | 主 Pitch + 次 Narrative | Pitch 主骨架 + 开场用一个具体案例钩 |
| "帮我做一份 NVIDIA 护城河分析" | Research | （见上面输出格式示例）|
| "帮我做一份 Claude Code 教程" | Teaching | 能做什么 → 装 CLI → 基础命令 → 进阶 → 验证 |
| "帮我做一份方案 PPT 给客户" | 主 Pitch + 次 Research | Pitch 骨架 + 论据章借 research 的证据展开 |

### 混合型骨架处理

主类型决定骨架形态。次类型在**某一个章节**里点缀，不改变整体骨架：

- 主 Research + 次 Narrative：在 "检验路径 X" 的一个小节里插入个案故事
- 主 Pitch + 次 Research：论据章（第 4 章）内部用研究型坐标系组织证据
- 主 Teaching + 次 Narrative：开场痛点章改成"一个踩坑故事"
- 主 Narrative + 次 Research：转折点（第 2/4 章）用反直觉数据作触发

## Claude Integration

当用户的请求触发本 skill：

1. **如果用户描述足够清晰**：直接按 Q1-Q3 链路诊断，给出判定 + personalize 骨架
2. **如果信息不足**：用 `AskUserQuestion` 逐层追问。**必问三项**：题目 · 素材 / 一手来源 · 目标观众 · （可选）时长预期
3. **输出骨架时一定要 personalize**：canonical 骨架是底稿，成品必须贴具体题目
4. **不要做立论**：本 skill 只给类型 + 骨架 + 下一步 skill 名。具体每章的推理链由 `ppt-research-setup` 等后继 skill 填

## 与下游 skill 的契约

`ppt-research-setup` 等下游 skill 会把本 skill 的骨架当**输入**：

- `ppt-classify` 输出章节名 + 章节角色 · **strategic level**
- `ppt-research-setup` 把每章填成 **Section 1 (反共识悖论具体措辞) + Section 2 (推理链)  + Section 3 (检验路径具体锚点)** · **tactical level**

两层职责不重叠：classify 管"这片子有哪些章"，research-setup 管"每章具体讲什么逻辑链"。

## 设计来源

本 skill 从 EP10《AI 做 PPT》实验 A 提炼。实验 A 发现把 pitch 型立论 skill 套到 research 型 PPT 会把研究者推成鼓吹者——分类是做 PPT 的真正零步。

**v0.2.0 变更**：EP10 正式录屏前发现原 v0.1.0 只给类型标签不给骨架，导致用户从"知道是哪种 PPT"到"知道要有几章" 之间有断层。v0.2.0 把骨架建议前移到 classify，让 Step 0 真正能作为"整体定调"来用——给策略 + 给骨架，下游 research-setup 只管填充每章细节。

详见：`notes/experiment-a-ceo-review.md` 和《PPT 演讲的分类和工作场景应用》。
