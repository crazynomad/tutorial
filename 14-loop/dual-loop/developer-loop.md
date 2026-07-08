# Developer Loop — 领工 developer（time-based，队列排空型）

> 在 [notebooklm-jetpack](https://github.com/crazynomad/notebooklm-jetpack) 仓库上实际运行的原版提示词。
> 角色：**吃队列**——每轮从看板 Todo 列领一个 `agent:ready` 的 issue，修完提 PR，队列空了自己收工。
> 与它搭档的理队列一侧见 [manager-loop.md](manager-loop.md)。

## 提示词（整段粘贴进 Claude Code）

```
/loop 你是本仓库的 developer。每轮只领一个 issue,做完就停,不串联多个。

领工规则:在既打了 agent:ready 标签、又在看板 Todo 列的 issue 中,
按复杂度 S→M→L 选一个(读 issue 描述末尾的「🤖 Triage 补全」块拿验收标准)。并把其分配到 In Progress
若某 issue 已存在包含「Closes #N」的开放 PR,跳过它(幂等)。
若没有可领的 issue,输出 no-op 并停止 loop。

单个 issue 的生命周期(直接调用 /fix-issue <N> 走完整 SOP,或手动照此做):
1. 从 main 切分支 fix/<N>-<slug>;
2. 只在该 issue「涉及模块」列出的范围内改代码,不碰核心导入 DOM 流程之外的东西,
   不动任何 needs:human 的 issue;
3. 验证:pnpm compile && pnpm test && pnpm build 必须通过;有 UI/运行时表面的,再跑 /verify;
4. 复核:改完后用 /code-review 审自己的 diff,发现问题先修再继续;
5. gh pr create,PR body 写「Closes #N」+ 测试结果 + 复核结论;
6. 在 issue 评论区贴 PR 链接,并把看板卡片从 Todo 挪到 In Review;
7. 本轮收工,进入下一轮领下一个。

边界:一个 issue 一个分支一个 PR,绝不把多个 issue 塞进一个 PR;
不合并 PR(留给我 review);测试红了就停下在 issue 评论里说明,不硬推。
```

## 契约拆解

| 零件 | 写法 | 为什么这么写 |
|---|---|---|
| **目标** | 每轮恰好消化**一个** issue，走完七步生命周期 | 「只领一个,做完就停」把批量风险切成了单发——每个 PR 都可独立 review、独立回滚 |
| **校验** | pnpm 三连硬验证 + `/code-review` 独立复核 | 复核是新开上下文的评审在审 diff——干活的不给自己打分 |
| **边界** | 一 issue 一分支一 PR；**不许自己合并**；只改「涉及模块」范围；不碰 needs:human | 合并权留给人 = 人只出现在最值钱的那道关口 |
| **停止** | 队列空 → no-op 并停止 loop | time-based 的停止 = "你取消，或活干完"——排空型占后一半 |

## 两个值得偷的细节

- **幂等规则**：领工前先查有没有包含 `Closes #N` 的开放 PR，有就跳过——防止上一轮的活被重复领（loop 重启、多实例并跑时都靠它兜底）。
- **不写间隔**：`/loop` 不带间隔走自调步模式——干完一个紧接着领下一个，不用死等时钟。它和 manager（30m 定时）的触发方式刻意不同：一个看钟，一个看队列。

## 与 Manager Loop 的配合

```
manager loop（30m 定时）           developer loop（自调步）
  整理 issue、补全描述                领一个 agent:ready 的 issue
  维持 Todo 列 5 张随时可开工   →      修完 → 测试 → 自审 → PR
  needs:human 的留言等拍板            队列空了自己收工
                 ↑                          ↓
            你只出现在两处：needs:human 拍板、PR review
```
