const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  "app.json",
  "app.js",
  "app.wxss",
  "project.config.json",
  "sitemap.json",
  "styles/tokens.wxss",
  "data/items.js",
  "data/orders.js",
  "services/auth.js",
  "services/items.js",
  "services/orders.js",
  "services/chats.js",
  "DEMO_GUIDE.md"
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing required file: ${file}`);
}
for (const file of requiredFiles.filter((file) => file.endsWith(".json"))) {
  JSON.parse(fs.readFileSync(path.join(root, file), "utf8").replace(/^\uFEFF/, ""));
}

const optionalJsonFiles = ["project.private.config.json"];
for (const file of optionalJsonFiles) {
  const filePath = path.join(root, file);
  if (fs.existsSync(filePath)) {
    JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
  }
}

const appJson = JSON.parse(fs.readFileSync(path.join(root, "app.json"), "utf8").replace(/^\uFEFF/, ""));
if (appJson.window.navigationBarTitleText !== "邻舍") throw new Error("Unexpected app title");
if (appJson.lazyCodeLoading !== "requiredComponents") throw new Error("Component lazy loading must be enabled");
if (!Array.isArray(appJson.pages) || appJson.pages.length < 17) throw new Error("Page route count is incomplete");

const expectedTabTexts = ["首页", "圈子", "发布", "消息", "我的"];
const actualTabTexts = appJson.tabBar.list.map((item) => item.text);
if (JSON.stringify(actualTabTexts) !== JSON.stringify(expectedTabTexts)) throw new Error("TabBar text mismatch");
for (const item of appJson.tabBar.list) {
  for (const icon of [item.iconPath, item.selectedIconPath]) {
    if (!fs.existsSync(path.join(root, icon))) throw new Error(`Tab icon missing: ${icon}`);
  }
}

const registeredRoutes = new Set(appJson.pages.map((page) => `/${page}`));
for (const page of appJson.pages) {
  for (const ext of [".json", ".js", ".wxml", ".wxss"]) {
    if (!fs.existsSync(path.join(root, `${page}${ext}`))) throw new Error(`Page file missing: ${page}${ext}`);
  }
  const pageJson = JSON.parse(fs.readFileSync(path.join(root, `${page}.json`), "utf8"));
  if (!pageJson.navigationBarTitleText) throw new Error(`Page title missing: ${page}.json`);
  const pageJs = fs.readFileSync(path.join(root, `${page}.js`), "utf8");
  const wxml = fs.readFileSync(path.join(root, `${page}.wxml`), "utf8");
  if (wxml.includes("待接入") || pageJs.includes("待接入") || pageJs.includes("TODO")) {
    throw new Error(`Unresolved placeholder found: ${page}`);
  }
  for (const match of wxml.matchAll(/\b(?:bindtap|catchtap)="([A-Za-z_$][\w$]*)"/g)) {
    const handler = match[1];
    if (!new RegExp(`\\b${handler}\\s*\\(`).test(pageJs)) {
      throw new Error(`WXML event handler not found: ${page}.wxml -> ${handler}`);
    }
  }
  for (const match of pageJs.matchAll(/url:\s*[`"]([^`"]+)/g)) {
    const route = match[1].split("?")[0];
    if (route.startsWith("/pages/") && !registeredRoutes.has(route)) throw new Error(`Unregistered route: ${route}`);
  }
}

const itemService = require(path.join(root, "services/items"));
const orderService = require(path.join(root, "services/orders"));
const chatService = require(path.join(root, "services/chats"));
const authService = require(path.join(root, "services/auth"));
const { getItems } = require(path.join(root, "data/items"));
const { getOrders } = require(path.join(root, "data/orders"));
const itemFields = ["item_id", "seller_id", "title", "price", "original_price", "images", "category", "condition", "campus_location", "status"];
const orderFields = ["order_id", "item_id", "buyer_id", "meetup_location", "trade_status", "verify_qr_code"];
const knownCategories = ["教材课本", "电子数码", "宿舍神器", "运动装备", "时尚穿搭", "乐器音响"];
function exactFields(record, fields, label) {
  const actual = Object.keys(record).sort();
  const expected = [...fields].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`${label} fields mismatch`);
}
for (const item of getItems()) {
  exactFields(item, itemFields, item.item_id);
  if (!["全新", "9成新", "良好"].includes(item.condition)) throw new Error(`Bad item condition: ${item.item_id}`);
  if (!knownCategories.includes(item.category)) throw new Error(`Bad item category: ${item.item_id}`);
  if (!["on_sale", "reserved", "sold"].includes(item.status)) throw new Error(`Bad item status: ${item.item_id}`);
}
if (getItems().length < 19) throw new Error("Demo item count is incomplete");
const categoryCounts = getItems().reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + 1;
  return acc;
}, {});
for (const category of knownCategories) {
  if ((categoryCounts[category] || 0) < 3) throw new Error(`Category too sparse: ${category}`);
}
for (const order of getOrders()) {
  exactFields(order, orderFields, order.order_id);
  if (!["wait_pay", "wait_meetup", "completed", "cancelled"].includes(order.trade_status)) throw new Error(`Bad order status: ${order.order_id}`);
}

const app = { globalData: { isVerified: false, userId: "buyer_test", campus: "北京大学" } };
if (authService.requireVerified(app).ok) throw new Error("Unverified user should be blocked");
authService.verifyStudent(app, { email: "student@pku.edu.cn", code: "123456" });
if (!app.globalData.isVerified) throw new Error("Student verification failed");
const order = orderService.createDemoOrder({ item_id: "item_003", buyer_id: "buyer_test", meetup_location: "图书馆南门" });
orderService.payDemoOrder(order.order_id);
if (orderService.getOrderView(order.order_id).order.trade_status !== "wait_meetup") throw new Error("Payment state failed");
orderService.completeDemoOrder(order.order_id);
if (orderService.getOrderView(order.order_id).order.trade_status !== "completed") throw new Error("Verification state failed");
const beforeMessages = chatService.getMessages("chat_001").length;
chatService.sendMessage("chat_001", "Demo 消息");
if (chatService.getMessages("chat_001").length !== beforeMessages + 1) throw new Error("Chat append failed");
const beforeItems = itemService.listItems().length;
itemService.createDemoItem({ title: "Demo 商品", price: 10, condition: "9成新" }, "seller_test");
if (itemService.listItems().length !== beforeItems + 1) throw new Error("Publish item creation failed");

console.log("Lin She mini program check passed.");

