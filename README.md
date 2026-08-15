# 邻舍二手

面向校园邻里场景的二手物品交易微信小程序 Demo。

项目以“同校认证、闲置发布、浏览搜索、议价下单、校内面交”为主线，演示一个完整但完全本地化的交易流程。当前版本不接入真实支付、后端服务、云数据库或实时通信，不产生真实资金流动。

## 项目概览

- **项目类型：** 微信小程序 Demo
- **主要场景：** 校园闲置物品交易
- **运行方式：** 微信开发者工具
- **数据来源：** 本地 JavaScript 模拟数据
- **状态存储：** 运行时内存
- **自动校验：** `npm run check`

## 已实现功能

### 商品浏览

- 首页商品流与分类切换
- 标题和校内地点关键词搜索
- 商品详情、价格、成色、卖家与面交地点展示
- 本地收藏状态和活动入口演示

### 学生认证

- 用户协议确认
- 校园邮箱认证流程演示
- 未认证用户的发布和交易权限阻断

> 认证逻辑仅用于界面与流程演示，不会发送真实验证码，也不构成真实身份认证。

### 发布与交易

- 商品标题、价格、分类和成色选择界面
- 议价与订单确认流程
- 本地模拟支付
- 面交地点展示
- 订单状态流转：
  `wait_pay → wait_meetup → completed`
- 本地模拟核销

### 消息与社区

- 会话列表和聊天详情
- 本地消息追加
- 从商品页联系卖家
- 社区动态、点赞、关注和分享交互演示

### 个人中心

- 认证状态展示
- 收藏、订单、钱包与安全入口
- 本地模拟充值、提现等交互

## 技术结构

项目采用原生微信小程序结构，没有引入前端框架或运行时依赖。

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
│  └─ check-project.js       # 项目结构与主流程校验
├─ 配套开发文档/             # DOCX/PDF 开发文档
├─ DEMO_GUIDE.md             # 演示路径与项目边界
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

这是公开的课程 Demo 仓库，可直接克隆使用。

### 2. 导入微信开发者工具

1. 打开微信开发者工具。
2. 选择“导入项目”。
3. 选择仓库根目录。
4. 默认使用 `project.config.json` 中的 `touristappid`；如需测试 AppID，请仅在本地个人配置中设置，勿提交个人 AppID。
5. 编译模式选择“普通编译”。

入口页面为：

```text
pages/index/index
```

微信开发者工具可能会生成个人配置文件：

```text
project.private.config.json
```

该文件已被 `.gitignore` 排除，不应提交。

### 3. 运行自动校验

本地需安装 Node.js，然后在仓库根目录执行：

```bash
npm run check
```

当前校验覆盖：

- 页面四件套完整性
- 页面路由注册
- TabBar 图标资源
- 页面标题
- WXML 事件处理器绑定
- 页面跳转路由
- 商品和订单字段结构
- 商品分类覆盖
- 学生认证流程
- 订单状态流转
- 消息追加
- 商品发布 Smoke Test

成功时输出：

```text
Lin She mini program check passed.
```

项目目前没有第三方 npm 运行时依赖，通常不需要先执行 `npm install`。

## Demo 数据与状态

当前商品、订单、会话和消息均由 `data/` 与 `services/` 中的 JavaScript 模块提供。

需要注意：

- 新发布商品、订单、聊天消息和认证状态只保存在运行时内存中。
- 关闭或重新启动小程序后，运行时变更会重置。
- 商品图片主要使用 Emoji 或本地静态资源表示。
- 搜索、筛选、上传、定位、支付、核销和钱包均为演示实现。

## 安全与隐私

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

`配套开发文档/` 保留在 Git 仓库中，但已通过 `project.config.json` 排除在微信小程序上传包之外。

## 当前边界

本项目定位为课程展示和原型验证，不应直接用于真实交易或生产部署。

尚未接入：

- 服务端 API
- 云数据库
- 微信登录与真实学生认证
- 微信支付
- 实时 IM
- 文件上传与对象存储
- 地理位置权限和地图选点
- 订阅消息
- 风控、举报与申诉系统
- 持久化收藏、订单和聊天记录

## 项目状态

本仓库用于移动应用开发课程期末作业展示，当前版本视为已完成，不计划继续进行生产化开发。

Code Review 中识别出的以下限制将作为 Demo 边界保留：

- 无效商品、订单或会话 ID 可能回退到默认演示数据。
- 部分商品未配置独立聊天会话。
- 发布页部分字段仍为静态交互。
- 学生认证、支付、核销、钱包和筛选均为模拟实现。
- 数据仅保存在运行时内存中，不具备持久化能力。

这些行为不影响既定演示路径，但意味着项目不应直接用于真实用户、真实交易或生产环境。

## 维护与自管

仓库由 DSH 工作区自管，管理入口（Windows PowerShell）：

```powershell
.\manage.ps1 status   # 仓库与工具状态
.\manage.ps1 check    # 权威验证（转发 bash scripts/check.sh → npm run ci）
.\manage.ps1 test     # 仅运行测试套件
.\manage.ps1 docs     # 文档清单
```

项目已按课程作业定稿，不计划继续生产化开发；详细治理规则见 `AGENTS.md`。

## 相关文档

- [`DEMO_GUIDE.md`](./DEMO_GUIDE.md)：推荐演示路径、功能边界和 Debug 记录
- [`配套开发文档/`](./配套开发文档/)：项目开发文档

## License

本项目采用 [MIT License](./LICENSE)。
