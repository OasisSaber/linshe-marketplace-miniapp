<!-- AW:BEGIN MANAGED -->
<!-- 本区块由 TheMasterplan（/TheMasterplan）管理（managed-block）。
     区块外内容属于项目，AW 不会覆盖；项目事实请维护在区块外。 -->

# TheMasterplan

> 本文件是本仓库唯一入口：定义加载顺序与分域权威，不复制规则正文。
> 规则分布：
> - 任务来源、工作区检查、验证真实性、diff 审阅、自审与交接：`core/workflow.md`
> - 权限与聚合授权、外部写操作边界、人类审批门、发布事务、安全停止条件：`core/policy.md`
> - Git / jj 发布执行命令：`profiles/`
> - Harness 映射：`adapters/`
> 各层通过链接引用，不复制同一规则。

## 权威顺序

1. 系统安全、法律与平台权限
2. 项目安全、隐私、合规和数据保护要求
3. 受保护分支、发布、部署和破坏性操作限制（授权语义见 `core/policy.md`）
4. 根部 `AGENTS.md` 及其引用的 `core/` 规则
5. 当前 Issue 或明确人类授权
6. 项目架构、测试和交付资料
7. README、CONTRIBUTING 和其他辅助材料

## 加载顺序

1. 根部 `AGENTS.md`（本文件）；
2. `core/workflow.md`（任务、验证、自审）；
3. `core/policy.md`（授权与发布）；
4. 选用的 `profiles/` 与 `adapters/`；
5. 当前 Issue 或明确人类授权。
<!-- AW:END MANAGED -->

## 项目事实

- 项目名：linshe-marketplace-miniapp
- 项目目标：林社社区市场微信小程序（WeChat Mini Program）
- 默认分支：`main`
- 工具基线：Jujutsu `0.43.0`（文档命令已验证）；Git `2.34.0` 或更高版本；Node.js（`npm run check`）
- 验证入口：
  ```bash
  bash scripts/check.sh
  ```
- 合并方式：只接受人类决定的 Squash Merge
- CI：通过 `OasisSaber/TheMasterplan` 中央 reusable workflow（`aw-check.yml@v1`）执行 PR 契约校验与项目验证；接口契约见 TheMasterplan 仓库 `docs/actions-interface.md`
- 当前 Issue 或明确人类授权只能定义任务目标、范围和验收条件，不能覆盖安全、隐私、合规、数据保护、受保护分支、发布、部署或破坏性操作限制。

## 采用记录

来源: TheMasterplan v3.0.0 (6e49aeeaa2eeaa8ce9be2d81a2fa8f5ba88bef18)
采用范围: 中央调用模式（已有 `.github/workflows/check.yml`）+ 最小采用集合（AGENTS.md + core/ + profiles/git.md + profiles/jj.md + adapters/generic.md + adapters/trellis.md）
采用日期: 2026-08-03
首次演练任务: /TheMasterplan 采用（明确人类授权：当前会话选择“采用/安装 TheMasterplan”）
Jujutsu 版本: 0.43.0-89f62ede8c1c611eaf134c0c49252efd65c7945d
Git 版本: 2.54.0
平台与验证入口: Windows / Bash（scripts/check.sh）
验证状态: PARTIAL（尚未在目标平台完成 TheMasterplan 发布烟雾测试）
首次演练 PR: https://github.com/OasisSaber/linshe-marketplace-miniapp/pull/16
