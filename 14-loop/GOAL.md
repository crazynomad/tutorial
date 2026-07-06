# Loop 契约：粒子模拟性能优化（EP14 hero demo）· v2

> v2 换尺（2026-07-06）：fps 被 60Hz vsync 封顶，跨过 16.6ms 后指标就失去分辨力——一轮就能过，不配当 loop demo。
> 改为**解除 vsync 后的每帧计算耗时（avg_ms）**：无天花板，直接反映运行效率。

## 校准（同一仪表实测）

| 版本 | avg_ms/frame | 等效 fps |
|---|---|---|
| particle-sim-baseline.html | **97.62** | 10.2 |
| 一轮朴素优化（空间网格）参考 | 9.09 | 110 |
| **目标** | **≤ 4.00** | ≈250 |

从 baseline 到目标 = **24 倍**；从一轮解到目标还差 2.3 倍——剩的全是硬骨头（拖尾逐段 stroke、AoS 布局、GC 尖刺:1% low 仅 47fps）。

## 录屏用 /goal（整行粘贴）

```
/goal 把 particle-sim-baseline.html 复制为 particle-sim.html,然后只优化 particle-sim.html 的运行效率。完成条件:运行 `node tools/measure-fps.mjs particle-sim.html` 输出 "pass":true(测量已解除 vsync:3000 粒子锁定、每帧平均计算耗时 avg_ms<=4.0、画布@dpr2 不缩水),并把该行 JSON 原样贴出来作为证据。规矩:①不许修改 tools/measure-fps.mjs,不许在页面代码里检测或特判测量环境;②不许减粒子数、缩画布、降 dpr、跳帧渲染;③拖尾、星座连线、辉光三层视觉效果与参数(TRAIL_LEN=8、LINK_DIST=90、辉光大小)一个不许删减;④碰撞物理保持两两弹性碰撞等价——允许空间分区、SoA、对象池、Worker 并行等等价优化,禁止抽样碰撞、隔帧碰撞、简化物理;⑤每轮改动后必须重跑测量脚本并贴出 JSON。or stop after 25 turns.
```

## 契约四零件对照（口播/教学用）

| 零件 | 对应条款 |
|---|---|
| **目标**（可判定） | `pass:true` = avg_ms≤4.0 且 particles=3000 |
| **验法**（判官只认晒出的证据） | 固定脚本 `measure-fps.mjs`（vsync 解除后帧间隔=真实每帧成本，页面自报的 ms 数不作数），每轮必贴 JSON |
| **规矩**（堵死作弊近路） | 减粒子/缩画布/降 dpr → 脚本自测；跳帧、假物理、砍视觉、改裁判、特判测量环境 → 条款①-④逐条封死 |
| **停止** | 达标即收；25 轮兜底 |

## 为什么换尺（教学点，幕3/幕4 素材）

- **指标要有分辨力**：fps 定 60，等于把门槛藏在 16.6ms——跨过去之后所有优化都不可见，loop 一轮就「达标」了。这是 eval 设计的第一课：**天花板贴着及格线的指标，量不出卓越**。
- 页面 HUD 上的 ms 读数是页面自己算的（agent 可改），不作裁判；裁判用测量脚本在 vsync 解除下数真实帧间隔——**仪表必须独立于被测物**。
- 视觉一致性是 L4（意见型裁判）：脚本每轮自动存截图到 `tools/shots/`，由人对比抽查，不假装成 L1。

## 复现

```bash
node tools/measure-fps.mjs                      # 测 baseline（约 25s，弹出 Chromium 窗口）
node tools/measure-fps.mjs particle-sim.html    # 测优化版
```

需要全局 playwright（`npm i -g playwright && npx playwright install chromium`）。
