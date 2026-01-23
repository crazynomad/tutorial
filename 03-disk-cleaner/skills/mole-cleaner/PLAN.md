# Mole Cleaner - 实现计划

> 目标：将 Mole 的 `mo clean` 包装成安全、可读、可确认的清理 Skill。

## 范围与原则

- macOS Only
- 默认先预览、后清理
- 以报告输出与风险提示为核心体验
- 删除由 Mole 执行，本工具只做流程编排与解析

---

## 里程碑与进度

### P0: 核心流程（已完成）

- [x] 环境检测（Homebrew / Mole / 版本）
- [x] 自动安装缺失依赖（Homebrew / Mole）
- [x] `mo clean --dry-run` 预览执行（TTY 兼容）
- [x] 输出解析与分类汇总
- [x] 可读报告生成（文本 + JSON）
- [x] 清理执行与前后空间对比
- [x] CLI 参数（check / preview / clean / status / auto-install / json / output）

### P1: 解析与报告增强（推进中）

- [ ] 更准确的类别与路径解析（减少“其他”）
- [x] 输出项目数量（文件数/目录数）
- [x] 解析 Mole 的保护项目清单（从输出提取）
- [x] 解析失败时的降级报告（可选关闭模拟数据）

### P2: 交互安全增强（未开始）

- [ ] 清理前二次确认（可选参数控制）
- [ ] 报告保存路径默认化（时间戳命名）
- [ ] 清理日志记录（命令输出 + 统计）

### P3: 兼容性与体验优化（未开始）

- [ ] 处理 Mole 输出变化的兼容策略（版本差异）
- [ ] 改善 TTY 捕获方式（非 `script` 方案备选）
- [ ] 更友好的错误提示（网络/权限/超时）

---

## 当前实现位置

- 入口脚本：`03-disk-cleaner/skills/mole-cleaner/scripts/mole_cleaner.py`
- 使用示例与说明：`03-disk-cleaner/skills/mole-cleaner/SKILL.md`

---

**创建日期**: 2026-01-23
**状态**: P0 完成，P1+ 待推进
