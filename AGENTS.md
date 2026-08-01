# linshe-marketplace-miniapp Agent Workflow

> 本文件是本仓库唯一具有约束力的通用工作流规则来源。

## 项目事实

- 项目名：linshe-marketplace-miniapp
- 项目目标：林社社区市场微信小程序（WeChat Mini Program）
- 默认分支：`main`
- 工具基线：Git `2.34.0` 或更高版本；Node.js（`npm run check`）
- 验证入口：
  ```bash
  bash scripts/check.sh
  ```
- 合并方式：只接受人类决定的 Squash Merge
- CI：通过 `OasisSaber/AgenticWonderwall` 中央 reusable workflow（`aw-check.yml@v1`）执行 PR 契约校验与项目验证；接口契约见 AW 仓库 `docs/actions-interface.md`

## 权威顺序

1. 系统安全、法律与平台权限
2. 项目安全、隐私、合规和数据保护要求
3. 受保护分支、发布、部署和破坏性操作限制
4. 根部 `AGENTS.md` 中的通用工作流规则
5. 当前 Issue 或明确人类授权
6. 项目架构、测试和交付资料
7. README、CONTRIBUTING、采用指南和其他辅助材料

## 任务路径

- 复杂任务：GitHub Issue → 一个变更 → 验证与 Agent 自审 → Pull Request → 人类决定 Squash Merge。
- 小型低风险任务：当前会话明确授权 → 一个变更 → 验证与 Agent 自审 → Pull Request 记录授权来源和范围 → 人类决定 Squash Merge。
- 无 Issue 时不得伪造编号。

## 验证、push 与 Pull Request

每次 push 前必须运行：

```bash
bash scripts/check.sh
```

验证失败时必须修正并重跑，不得把失败或未验证状态表述为成功。

## Agent 自审

创建或更新 Pull Request 前，Agent 必须：

1. 对照 Issue 或明确人类授权检查结果；
2. 阅读完整 diff；
3. 运行必要验证并记录真实结果；
4. 确认没有扩大范围；
5. 确认没有调试代码、临时文件、缓存、误删或失效引用；
6. 在 Pull Request 中说明已知限制和未覆盖内容。

## 人工保留操作

Agent 不得自行 merge、release、删除远端数据、执行破坏性操作或扩大范围。这些操作始终需要人类单独、明确决定。

## 安全与卫生

- 不提交密钥、访问令牌或明显的私人数据。
- 不提交本机绝对路径、缓存、临时文件或无关生成物。
- `main` 只接受经 Pull Request 的人类决定 Squash Merge。
