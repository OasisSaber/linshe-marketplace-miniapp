# 项目归档说明（ARCHIVE.md）

- **归档日期：** 2026-08-12
- **仓库：** `OasisSaber/linshe-marketplace-miniapp`
- **状态：** 已停止主动开发，GitHub 仓库归档为只读存档

## 项目定位

邻舍二手 —— 面向校园邻里场景的二手物品交易微信小程序课程 Demo（原生微信小程序，本地模拟数据，无第三方运行时依赖，不接入后端 / 支付）。

## 停止开发原因

Development progress and maintenance momentum no longer justify continued investment.

## 最终功能范围

- 首页商品流、分类切换、标题与地点关键词搜索
- 独立筛选页（关键词、分类、价格、最新、面交）与排序
- 商品详情（按真实 `item_id` 加载，无效 ID 显示 not-found）
- 学生认证（校园邮箱 + 演示验证码，确定性校验）
- 商品发布（标题、描述、价格、分类、成色、地点、面交开关）
- 议价与结算（成交价、费用、优惠、总额快照；拒绝无效、高于标价及归一化后低于 `0.01` 的金额）
- 订单支付与核销（仅允许合法状态迁移；Demo 支付失败自动取消订单并恢复商品；订单最终拒绝高于标价的成交价）
- 会话列表与本地消息追加（仅内存）
- 收藏（首页、详情、收藏和个人中心共享同一收藏服务；按商品隔离的 300ms 防连点）
- 卖家主页（按 `seller_id` 加载资料与商品）
- 校园社区互动（本地演示）
- 钱包 / 充值 / 提现（UI_ONLY / LOCAL_DEMO，无资金流动）

## 已知限制

- 数据与状态仅存于当前运行进程内存，重启即重置
- 未接入真实后端、云数据库、真实支付、退款与纠纷处理
- 未实现图片上传、GPS 定位、实时 IM、订阅消息
- 微信开发者工具需使用 `touristappid`（体验版 / 项目配置默认值）打开

## 最终验证情况

- `npm test`：51/51 通过
- `bash scripts/check.sh`（结构检查 + UI 契约检查 + 全部测试）：通过
- `node scripts/validate-ui-contracts.js`：通过
- GitHub Actions（aw-check.yml@v1）：通过
- 微信开发者工具人工 Smoke Test：2026-08-11 完成（含收藏防连点专项）

## 最后合并 PR

- **PR #21** `fix(flow): refresh item availability and make checkout orchestration recoverable`（Squash Merge）
- Squash 标题：`fix(flow): finalize transaction consistency and interaction safeguards`
- Merge commit：`a60446c74246dbb1ce9efd163c5cb48ade613220`

## 最终 commit SHA

归档说明提交后以 `git log -1` 为准（`archive-2026-08-12` Tag 指向该提交）。

## 不再维护声明

本仓库自 2026-08-12 起不再接受功能开发、Issue 处理或维护更新，GitHub 仓库已标记 Archived。

## 未来重新启动的方法

如未来需要恢复开发：

1. GitHub Settings → Unarchive this repository
2. 拉取 `main` 与 `archive-2026-08-12` Tag 确认基线
3. 从 `main` 创建新分支继续开发

恢复开发时请注意：当前代码为课程 Demo 架构（本地内存模拟数据），真实服务化需要从数据层与认证、支付、消息等外部依赖重新设计。
