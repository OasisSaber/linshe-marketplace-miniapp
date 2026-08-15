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
平台与验证入口: Windows / Bash（scripts/check.sh；无 check.ps1/pwsh，PowerShell 委托入口不在采用范围）
验证状态: VERIFIED（Windows Bash 入口端到端演练通过，见下方演练记录）
首次演练 PR: https://github.com/OasisSaber/linshe-marketplace-miniapp/pull/16

### 演练记录（2026-08-03）

- 演练任务: Issue #8 fix(auth): validate campus email and demo verification code deterministically
- 演练 PR: https://github.com/OasisSaber/linshe-marketplace-miniapp/pull/17（Draft 创建 → 人类 Squash Merge）
- 合并提交: 814495d36c3ef1702dce77485e9f070023e81ef6
- 变更文件: services/auth.js、pages/auth/login.js、DEMO_GUIDE.md、test/auth.test.js、package.json
- 验证结果: bash scripts/check.sh（npm run check）通过；npm test 8/8 通过；CI aw-check（aw-check.yml@v1）通过
- 平台限制: Windows / Bash 入口完成端到端演练；scripts/ 无 check.ps1 且 pwsh 不可用

### 重启重新采用（2026-08-15）

- 背景: 仓库 2026-08-12 归档（archive-2026-08-12），2026-08-15 解除归档并重启开发（明确人类授权：用户选择在新基线上重新采用）
- 新基线: `restart-v0.1.0` 分支（87cb9ef，v0.1.0 初始公开版，2026-07-23）
- 采用范围: 与首次一致（中央调用模式 + 最小采用集合）
- 状态差异: 测试套件已重建（2026-08-15，39 个测试覆盖 auth/items/orders/chats/data 一致性），`scripts/check.sh` 执行 `npm run ci`（结构检查 + 全部测试）；CI check.yml 已随治理文件恢复
- 验证状态: `bash scripts/check.sh`（npm run check + npm test 39/39）通过，完整演练待后续任务补做

### 治理升级（2026-08-15）

- 上游: TheMasterplan v4.0.0（8895a00，PR #79）
- 同步: core/workflow.md（新增 §0 治理所有权预检/ABSTAINED + PR 后 CI 门）、adapters/generic.md（重写为薄 Harness 边界）
- 移除: adapters/trellis.md（上游 v4.0.0 已删除；外部交付工作流一律 ABSTAINED，不再维护兼容层）
- 授权: 用户明确选择更新治理文件（当前会话）

## DSH 自管（2026-08-16 接管）

DSH（DeepSeek Harness）会话在本工作区的自管约定，与 TTS/Ollama/AirLLM 工作区同范式：

- 管理入口: `.\manage.ps1`（status | check | test | docs | help）；输出为 ASCII，兼容 Windows PowerShell 5.1
- 权威验证: `bash scripts/check.sh`（`npm run ci` = 结构检查 + 全部测试）；manage.ps1 check 只转发该命令，不另设验证逻辑
- 仓库状态: jj 0.43.0 为工具基线（仓库同时有 `.git`）；当前基线分支 `restart-v0.1.0`（默认分支 `main` 只接受人类 Squash Merge）
- 项目定位: 课程展示 Demo，已视为完成、不计划生产化开发；无常驻服务、无 npm 运行时依赖，通常无需 `npm install`
- 边界: 不提交个人 AppID（`project.private.config.json` 已由 .gitignore 排除）、不接入真实支付/认证/后端
- VCS 纪律: 遵循 core/workflow.md——接管类文件改动由 DSH 会话在本地完成，不自行 push/PR，交由人类决定提交方式
