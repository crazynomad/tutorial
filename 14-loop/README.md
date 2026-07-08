# EP14 · Loop Engineering — 四个可复现 demo

> 绿皮火车 EP14《Loop Engineering》的配套资源。四个 demo 全部在真实环境跑过，提示词/契约原文照录，可直接复现。
> 频道：[YouTube 绿皮火车](https://www.youtube.com/@greentrainpodcast) · [B站](https://space.bilibili.com/565619114)

## Loop 的两大类

- **goal-based（结果导向型）**：给一个验收标准，达标就收——原语 `/goal`。适合终点清晰、路径不明的活。
- **time-based（节拍型）**：给一个触发器，到点就跑——原语 `/loop`、`/schedule`。适合重复出现、裁判现成的活。

（agent 内部自带的执行循环、以及事件驱动的全自主形态，不在本期展开。）

## 四个 demo

| 目录 | 类型 | 任务 | 裁判 |
|---|---|---|---|
| [performance-tuning/](performance-tuning/) | goal-based | 粒子模拟页性能优化：97.6ms/帧 → ≤4ms，粒子数/视觉效果不许动 | 固定测量脚本，每轮必贴 JSON 证据 |
| [reproducing-paper/](reproducing-paper/) | goal-based | 从零复现《Deep Hedging》论文的实验数字：读论文、写代码、逐条对数 | 双层契约：数值阈值刻度 + 诚实受阻出口 |
| [dual-loop/manager-loop.md](dual-loop/manager-loop.md) | time-based | GitHub backlog 值守：30 分钟一轮整理 issues + 看板 | 三条可判定不变量 + gh 逐条重查 + no-op 诚实条款 |
| [dual-loop/developer-loop.md](dual-loop/developer-loop.md) | time-based | 领工干活：每轮修一个 issue，测试 + 独立复核 + PR 留人合 | pnpm 三连 + /code-review 独立复核 |

四个 demo 共用同一副契约骨架——**目标（可判定）/ 校验（不听它自己汇报）/ 边界（能动什么）/ 停止（什么时候收）**。差异只在裁判怎么当：

- 性能优化：**仪表说了算**——指标要有分辨力（fps 被 vsync 封顶后换 ms，见 performance-tuning/GOAL.md 的 v2 换尺记录）；
- 论文审计：**刻度写进契约**——不许干活的自己发明「近似复现」这种形容词；
- 双循环：**状态与队列说了算**——manager 维持不变量，developer 排空队列，人只出现在 needs:human 拍板和 PR review 两处。

## 复现前的三句提醒

1. **先装刹车再点火**：轮数上限（`or stop after N turns`）、预算、DRY-RUN 先行——循环会自主烧 token 直到达标。
2. **别跑太勤**：time-based 的间隔要匹配对象的变化速度；全是 no-op 就拉长间隔或停掉。
3. **裁判会老**：验收标准是今天定的，记得定期用真实失败案例更新它。
