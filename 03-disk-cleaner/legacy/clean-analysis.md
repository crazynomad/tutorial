简要分析：`mo clean` 的执行入口在 `bin/clean.sh`，总体流程是「准备与权限 → 分区清理 → 汇总输出」，核心删除动作都走安全封装（路径校验 + 保护规则 + 白名单）。

入口与流程
- `mo clean` → `bin/clean.sh`：加载各清理模块并解析参数（`--dry-run`、`--whitelist`）。
- `start_cleanup`：提示是否启用系统级清理（需要 sudo），否则只做用户级清理。
- `perform_cleanup`：按“分区”依次调用 `clean_*` 函数，最后输出汇总统计。
- `safe_clean`：统一的删除封装，负责路径去重、白名单与保护校验、统计大小、干跑输出等。

安全策略（核心防护）
- 路径验证与安全删除：`lib/core/file_ops.sh`（`safe_remove` / `safe_sudo_remove` / `validate_path_for_deletion`）。
- 保护规则：`lib/core/app_protection.sh`（系统关键组件、敏感数据应用、白名单匹配）。
- 白名单：`~/.config/mole/whitelist`，默认白名单见 `lib/core/base.sh`。
- `--dry-run`：不删除，只统计并导出列表到 `~/.config/mole/clean-list.txt`（在 `bin/clean.sh`）。

清理分区与模块（实际清理内容）
- 系统级（sudo）：`lib/clean/system.sh`
  - 例：`/Library/Caches`、`/private/var/log`、`/private/tmp`、Time Machine 临时/快照等。
- 用户级基础：`lib/clean/user.sh`
  - Finder 元数据、系统缓存、最近使用、Mail 下载、沙盒 App 缓存、浏览器/云盘/Office/虚拟化等。
- 开发者工具：`lib/clean/dev.sh`
  - npm/pip/go/rust/docker 等缓存，项目缓存，Homebrew 清理（含 `lib/clean/brew.sh`）。
- App 缓存分类：`lib/clean/app_caches.sh`
  - 通讯、设计、媒体、IDE 等各类应用缓存。
- 应用残留：`lib/clean/apps.sh`
  - .DS_Store 清理、孤儿数据、孤儿系统服务等。

你可以从这些文件深入追踪
- 主流程：`bin/clean.sh`
- 安全删除/校验：`lib/core/file_ops.sh`
- 保护规则与白名单：`lib/core/app_protection.sh`, `lib/core/base.sh`
- 各清理模块：`lib/clean/system.sh`, `lib/clean/user.sh`, `lib/clean/dev.sh`, `lib/clean/app_caches.sh`, `lib/clean/apps.sh`
