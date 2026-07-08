# Manager Loop — backlog 管理员（time-based，值守型）

> 在 [notebooklm-jetpack](https://github.com/crazynomad/notebooklm-jetpack) 仓库上实际运行的原版提示词。
> 角色：**理队列**——每 30 分钟整理一轮 issues 和看板，让 Todo 列永远有 5 个「随时可开工」的 issue。
> 与它搭档的吃队列一侧见 [developer-loop.md](developer-loop.md)。

## 提示词（整段粘贴进 Claude Code）

```
/loop 30m 你是代码仓库的 backlog 管理员,调用 backlog-manager skill(apply 模式),整理本仓库的 GitHub issues 和看板。
目标(每轮要恢复的状态,可判定):
1. 看板卡片与 issue 真实进展一致——不许出现「issue 已关闭,卡片还在进行中」这类漂移;
2. Todo 列只保留最多 5 个「随时可开工」的 issue:描述完整、无依赖阻塞、已打 agent:ready;
3. 每个 needs:human 的 issue,评论区都留有具体提问,等我拍板。
校验(输出自证):每轮结束输出 Agent Assessment 整理报告,并用 gh 逐条重查本轮改动,把「改动前→改动后」状态贴进报告;本轮无事可做时,如实输出 no-op 报告,不许制造改动。
边界:只许四类操作——改标签、改看板卡片状态、发 issue 评论、在 issue 描述末尾追加补充区块;不许关闭 issue、不许新建 issue、不许改代码。
让路规则(轮内):遇到需要权限之外的操作、或新出现的 needs:human,只在评论区留下具体提问,本轮收工。
停止条件:loop 由我取消;若连续 3 轮 no-op,在报告里建议我停掉或拉长间隔。
```

## 契约拆解（和 goal-based 契约的关键差异）

| 零件 | 写法 | 为什么这么写 |
|---|---|---|
| **目标** | 三条**要恢复的状态**（不变量），不是一次性终点 | 值守型 loop 没有「做完」——每轮的成功 = 三条不变量都成立 |
| **校验** | gh 逐条重查 + 改动前→后对照；**无事可做如实报 no-op** | no-op 条款是定时型专属的防作弊栅栏：不许为了「显得干了活」制造改动 |
| **边界** | 四类操作白名单 + 三禁（不关 issue / 不建 issue / 不改代码） | apply 模式有写权限，白名单外的动作要显式封死 |
| **停止** | 由你取消（+ 连续 3 轮 no-op 时自我建议停掉） | time-based 的停止 = "你取消，或活干完"——值守型占前一半 |

## 前置要求

- `gh` CLI 已登录，具备 `repo` + `project` scopes；
- 仓库有 GitHub Projects 看板（列含 Todo / In Progress / In Review）；
- 本例调用了自研 `backlog-manager` skill（config 驱动，默认 DRY-RUN，传 `apply` 才写）。没有这个 skill 也能跑：提示词里的目标/校验/边界本身就是完整规格，Claude 会直接用 `gh` 完成同样的事。

## 上手建议

1. **第一轮别加 apply**：先看它的 DRY-RUN 整理报告，确认动作对了再放开写权限（先装刹车再点火）。
2. **间隔匹配变化速度**：backlog 变化慢，30 分钟起步；跑几轮发现全是 no-op，就拉长间隔。
3. `/loop` 是 session 级的（关终端就停）；要长期无人值守，换 `/schedule` 挪到云端。
