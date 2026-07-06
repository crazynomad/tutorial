# Loop 契约：粒子模拟性能优化（EP14 hero demo）

基线实测（2026-07-06）：3000 粒子 · avg **10.1 fps** · 1% low 7.5 · 3200×1711 @dpr2
目标：同一测量脚本下 avg **≥ 59 fps**（rAF 在 60Hz 显示器封顶 60，59 防抖动误杀）

## 录屏用 /goal（整行粘贴）

```
/goal 把 particle-sim-baseline.html 复制为 particle-sim.html,然后只优化 particle-sim.html 的性能。完成条件:运行 `node tools/measure-fps.mjs particle-sim.html` 输出 "pass":true(3000 粒子锁定、avg_fps>=59、画布@dpr2 不缩水),并把该行 JSON 原样贴出来作为证据。规矩:①不许修改 tools/measure-fps.mjs,不许在页面代码里检测或特判测量环境;②不许减粒子数、缩画布、降 dpr、跳帧渲染;③拖尾、星座连线、辉光三层视觉效果与参数(TRAIL_LEN=8、LINK_DIST=90、辉光大小)一个不许删减;④碰撞物理保持两两弹性碰撞等价——允许空间分区、SoA、对象池等等价优化,禁止抽样碰撞、隔帧碰撞、简化物理;⑤每轮改动后必须重跑测量脚本并贴出 JSON。or stop after 25 turns.
```

## 契约四零件对照（口播/教学用）

| 零件 | 对应条款 |
|---|---|
| **目标**（可判定） | `pass:true` = avg_fps≥59 且 particles=3000 |
| **验法**（判官只认晒出的证据） | 固定脚本 `measure-fps.mjs` 的 JSON 输出，每轮必贴（/goal 判官是独立模型、不跑命令，只看对话里的证据） |
| **规矩**（堵死作弊近路） | 减粒子/缩画布/降 dpr → 脚本自测；跳帧、假物理、砍视觉、改裁判、特判测量环境 → 条款 ①-④ 逐条封死 |
| **停止** | 达标即收；25 轮兜底 |

## 作弊近路 ↔ 栅栏（Elvis Sun 教训的本地化）

- 「没堵死的每条近路，优化器都会冲下去」——每条规矩都对应一条真实可走的捷径。
- 「没有仪表的约束就是一句空话」——粒子数、画布、dpr 都由脚本亲测，不听 agent 自述。
- 视觉一致性是 L4（意见型裁判）：脚本每轮自动存截图到 `tools/shots/`，由人对比抽查，**不假装成 L1**。

## 复现

```bash
node tools/measure-fps.mjs                      # 测 baseline（约 25s，弹出 Chromium 窗口）
node tools/measure-fps.mjs particle-sim.html    # 测优化版
```

需要全局 playwright（`npm i -g playwright && npx playwright install chromium`）。
