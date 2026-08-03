# 邻舍二手

面向校园邻里场景的二手物品交易微信小程序课程 Demo。

项目通过本地模拟数据展示“浏览商品、学生认证、发布闲置、议价下单、校内面交、消息沟通和个人中心”等主要产品路径。它用于课程展示与交互原型验证，不是已经上线的校园交易服务。

## 项目定位

- **项目类型：** 移动应用开发课程作业 / 微信小程序 Demo
- **主要用户：** 项目作者、教师、同学和答辩演示人员
- **运行平台：** 微信开发者工具
- **数据来源：** 本地 JavaScript 模拟数据
- **状态存储：** 当前运行进程内存
- **后端服务：** 未接入
- **真实支付：** 未接入
- **自动校验：** `npm run check`、`npm test` 和 `bash scripts/check.sh`，分别覆盖结构/UI 契约、Node 单元测试与完整 CI 门禁

本项目当前不以多租户、公共 API、企业级权限、高可用、全平台发行或生产级安全治理为目标。

## 能力状态说明

| 状态 | 含义 |
| --- | --- |
| `VERIFIED` | 当前代码中已连接到共享数据或服务，并由项目检查覆盖主要正常路径 |
| `PARTIAL` | 页面或部分逻辑已存在，但数据闭环、异常处理或跨页面一致性尚未完成 |
| `LOCAL_DEMO` | 仅使用本地内存模拟，不代表真实服务能力 |
| `UI_ONLY` | 主要用于界面和交互展示，未形成完整业务逻辑 |
| `NOT_IMPLEMENTED` | 当前版本未实现 |

## 当前能力矩阵

| 能力 | 状态 | 当前说明 | 跟踪 |
| --- | --- | --- | --- |
| 首页商品流与分类切换 | `VERIFIED` | 基于本地商品数据展示和过滤 | — |
| 首页标题与地点关键词搜索 | `VERIFIED` | 在首页商品流内即时过滤 | — |
| 独立筛选页与排序 | `VERIFIED` | 使用共享商品服务执行关键词、分类、价格、最新和面交筛选 | — |
| 商品详情 | `VERIFIED` | 按真实 `item_id` 加载，无效 ID 展示 not-found 状态 | — |
| 学生认证 | `LOCAL_DEMO` / `VERIFIED` | 使用演示验证码并校验邮箱、域名和验证码格式 | — |
| 商品发布 | `LOCAL_DEMO` / `VERIFIED` | 标题、描述、价格、分类、成色、地点和面交开关进入共享商品服务 | — |
| 议价与结算 | `LOCAL_DEMO` / `VERIFIED` | 出价和结算使用成交价、费用、优惠和总额快照 | — |
| 订单支付与核销 | `LOCAL_DEMO` / `VERIFIED` | 仅允许合法状态迁移，重复和逆向操作显式失败 | — |
| 商品与订单状态同步 | `LOCAL_DEMO` / `VERIFIED` | 创建、完成、取消订单分别同步 reserved、sold、on_sale | — |
| 会话列表与本地消息追加 | `LOCAL_DEMO` | 消息仅保存在当前运行内存中 | — |
| 收藏 | `LOCAL_DEMO` / `VERIFIED` | 首页、详情、收藏和个人中心读取同一收藏服务状态 | — |
| 卖家主页 | `LOCAL_DEMO` / `VERIFIED` | 按 `seller_id` 加载卖家资料与该卖家的商品 | — |
| 校园社区互动 | `LOCAL_DEMO` | 发帖、点赞、关注和分享为本地交互演示 | — |
| 钱包、充值与提现 | `UI_ONLY` / `LOCAL_DEMO` | 不产生资金流动 | — |
| 图片上传、GPS 定位 | `NOT_IMPLEMENTED` | 页面中存在演示入口或静态展示 | #4 |
| 云数据库、实时 IM、订阅消息 | `NOT_IMPLEMENTED` | 属于未来真实服务化方向，不阻断课程 Demo | — |
| 微信支付、退款、纠纷处理 | `NOT_IMPLEMENTED` | 当前不处理真实资金和售后 | — |

## 推荐演示路径

具体演示步骤见 [`DEMO_GUIDE.md`](./DEMO_GUIDE.md)。

推荐从首页开始，依次展示：

1. 商品浏览和分类切换
2. 商品详情
3. 学生认证阻断
4. 议价与本地结算
5. 本地订单状态流转
6. 消息会话
7. 发布和社区交互
8. 个人中心、钱包和安全页面

演示应遵循文档中的正常路径。异常参数、跨页面收藏同步、完整发布字段和严格订单状态机已由服务契约与 Node 测试覆盖；真实后端能力仍不在本地 Demo 范围内。

## 技术结构

项目采用原生微信小程序结构，没有引入前端框架或第三方运行时依赖。

```text
linshe-marketplace-miniapp/
├─ app.js                    # 全局 Demo 状态
├─ app.json                  # 页面路由、窗口与 TabBar 配置
├─ app.wxss                  # 全局样式
├─ data/                     # 商品和订单等本地模拟数据
├─ images/                   # TabBar 和页面图片资源
├─ pages/                    # 小程序页面
│  ├─ auth/                  # 登录与学生认证
│  ├─ community/             # 校园社区
│  ├─ goods/                 # 商品详情与议价
│  ├─ index/                 # 首页
│  ├─ message/               # 会话与聊天
│  ├─ order/                 # 结算与订单详情
│  ├─ profile/               # 个人中心
│  ├─ publish/               # 商品发布
│  └─ search/                # 搜索筛选
├─ services/                 # 认证、商品、订单和消息逻辑
├─ styles/                   # 设计变量与公共样式
├─ scripts/
│  └─ check-project.js       # 结构检查与正常路径 Smoke Test
├─ 配套开发文档/             # 课程提交快照
├─ DEMO_GUIDE.md             # 演示步骤和已知边界
├─ package.json
├─ project.config.json
└─ sitemap.json
```

## 本地运行

### 1. 获取代码

```bash
git clone https://github.com/OasisSaber/linshe-marketplace-miniapp.git
cd linshe-marketplace-miniapp
```

### 2. 导入微信开发者工具

1. 打开微信开发者工具。
2. 选择“导入项目”。
3. 选择仓库根目录。
4. 默认使用 `project.config.json` 中的 `touristappid`。
5. 如需测试 AppID，请只写入本地个人配置，不要提交个人 AppID。
6. 编译模式选择“普通编译”。

入口页面：

```text
pages/index/index
```

微信开发者工具可能生成：

```text
project.private.config.json
```

该文件已被 `.gitignore` 排除。

### 3. 运行项目检查

本地安装 Node.js 后执行：

```bash
npm run check
npm test
bash scripts/check.sh
```

当前检查覆盖：

- 必需文件存在性
- JSON 文件可解析性
- 页面四件套完整性
- 页面路由注册
- TabBar 图标资源
- 页面标题
- 部分 WXML 事件处理器绑定
- 静态页面跳转路由
- 商品和订单字段结构
- 商品分类和样例数量
- 正常路径下的认证、订单流转、消息追加和商品创建 Smoke Test

成功时输出：

```text
Lin She mini program check passed.
```

`npm run check` 负责结构与 UI 契约检查，`npm test` 覆盖认证、实体查询、收藏、搜索、发布和订单失败路径；`bash scripts/check.sh` 执行完整 CI 门禁。微信开发者工具真机渲染、真实支付、认证和后端能力仍不在本地 Demo 范围内。

项目目前没有第三方 npm 运行时依赖，通常不需要先执行 `npm install`。

## Demo 数据与状态

当前商品、订单、会话和消息由 `data/` 与 `services/` 中的 JavaScript 模块提供。

需要注意：

- 新发布商品、订单、聊天消息和认证状态只保存在运行时内存中。
- 关闭或重新启动小程序后，运行时变更会重置。
- 商品图片主要使用 Emoji 或本地静态资源表示。
- 搜索筛选、上传、定位、支付、核销和钱包包含不同程度的演示实现。
- 无效实体 ID 的错误处理尚待 #1 完成。

## Backlog 与实施顺序

当前工作已拆分为可独立关闭的 Issue：

1. #1：拒绝无效商品、订单和会话 ID
2. #2：约束订单状态迁移
3. #3：保存成交快照并同步商品状态
4. #4：打通发布表单和成功页
5. #5：统一收藏状态
6. #6：使用真实商品数据实现筛选
7. #7：按卖家 ID 加载卖家主页
8. #8：收紧 Demo 认证输入验证
9. #9：增加失败路径测试和 GitHub Actions
10. #10：统一文档事实与维护来源

推荐先完成数据完整性和订单状态，再处理发布、收藏和搜索，最后补充测试与文档同步。

## 安全与隐私边界

仓库通过 `.gitignore` 排除：

- `project.private.config.json`
- `.env` 和其他环境变量文件
- 私钥与证书文件
- `node_modules/`
- `miniprogram_npm/`
- 压缩备份和本地数据库
- 编辑器及操作系统临时文件

项目不应包含或处理：

- 微信小程序 AppSecret
- 真实支付凭据
- API Token
- 用户密码
- 真实身份证件或学生证数据
- 生产环境数据库连接信息

如果未来接入真实账户、支付、云数据库或公共服务，需要重新设计身份、权限、隐私、审计和交易安全，不应直接将当前 Demo 逻辑用于生产环境。

## 文档维护规则

- 根目录 `README.md` 是当前能力、限制和 Backlog 的事实来源。
- `DEMO_GUIDE.md` 只描述推荐演示操作和已知演示边界。
- `配套开发文档/` 中的 DOCX 与 PDF 是课程提交快照，不保证随源码持续更新。
- 项目当前没有需要独立维护的 `ROADMAP.md`、`AGENTS.md`、`SKILL.md` 或 `CONTRIBUTING.md`；只有出现明确协作或 Agent 工作流需求时才应新增。

## License

本项目采用 [MIT License](./LICENSE)。
