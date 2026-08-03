const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8").replace(/^\uFEFF/, "");
}

function requireFile(relativePath) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
}

const requiredFiles = [
  "app.json",
  "app.js",
  "app.wxss",
  "project.config.json",
  "sitemap.json",
  "styles/tokens.wxss",
  "styles/components.wxss",
  "data/items.js",
  "data/orders.js",
  "data/sellers.js",
  "services/auth.js",
  "services/items.js",
  "services/orders.js",
  "services/chats.js",
  "services/favorites.js",
  "services/search.js",
  "services/sellers.js",
  "scripts/validate-ui-contracts.js",
  "DEMO_GUIDE.md"
];

for (const file of requiredFiles) requireFile(file);
for (const file of requiredFiles.filter((file) => file.endsWith(".json"))) {
  JSON.parse(readText(file));
}

const appJson = JSON.parse(readText("app.json"));
if (appJson.window.navigationBarTitleText !== "邻舍") {
  throw new Error("Unexpected app title");
}
if (appJson.lazyCodeLoading !== "requiredComponents") {
  throw new Error("Component lazy loading must be enabled");
}
if (!Array.isArray(appJson.pages) || appJson.pages.length < 17) {
  throw new Error("Page route count is incomplete");
}

const expectedTabTexts = ["首页", "圈子", "发布", "消息", "我的"];
const actualTabTexts = appJson.tabBar.list.map((item) => item.text);
if (JSON.stringify(actualTabTexts) !== JSON.stringify(expectedTabTexts)) {
  throw new Error("TabBar text mismatch");
}

for (const item of appJson.tabBar.list) {
  for (const icon of [item.iconPath, item.selectedIconPath]) {
    requireFile(icon);
  }
}

const registeredRoutes = new Set(appJson.pages.map((page) => `/${page}`));
const eventPattern = /\b(?:bindtap|catchtap|bindinput|bindchange|bindconfirm)="([A-Za-z_$][\w$]*)"/g;

for (const page of appJson.pages) {
  for (const ext of [".json", ".js", ".wxml", ".wxss"]) {
    requireFile(`${page}${ext}`);
  }

  const pageJson = JSON.parse(readText(`${page}.json`));
  if (!pageJson.navigationBarTitleText) {
    throw new Error(`Page title missing: ${page}.json`);
  }

  const pageJs = readText(`${page}.js`);
  const wxml = readText(`${page}.wxml`);

  if (wxml.includes("待接入") || pageJs.includes("待接入") || pageJs.includes("TODO")) {
    throw new Error(`Unresolved placeholder found: ${page}`);
  }

  for (const match of wxml.matchAll(eventPattern)) {
    const handler = match[1];
    if (!new RegExp(`\\b${handler}\\s*\\(`).test(pageJs)) {
      throw new Error(`WXML event handler not found: ${page}.wxml -> ${handler}`);
    }
  }

  for (const match of pageJs.matchAll(/url:\s*[`"]([^`"]+)/g)) {
    const route = match[1].split("?")[0];
    if (route.startsWith("/pages/") && !registeredRoutes.has(route)) {
      throw new Error(`Unregistered route: ${route}`);
    }
  }
}

function requireFields(record, fields, label) {
  for (const field of fields) {
    if (!Object.prototype.hasOwnProperty.call(record, field)) {
      throw new Error(`${label} missing field: ${field}`);
    }
  }
}

const itemData = require(path.join(root, "data/items"));
const orderData = require(path.join(root, "data/orders"));
const itemService = require(path.join(root, "services/items"));
const orderService = require(path.join(root, "services/orders"));
const chatService = require(path.join(root, "services/chats"));
const authService = require(path.join(root, "services/auth"));
const favoriteService = require(path.join(root, "services/favorites"));
const searchService = require(path.join(root, "services/search"));
const sellerService = require(path.join(root, "services/sellers"));
const { resetIds } = require(path.join(root, "services/id"));

const itemFields = [
  "item_id", "seller_id", "title", "description", "price", "original_price",
  "images", "category", "condition", "campus_location", "supports_meetup",
  "status", "created_at"
];
const orderFields = [
  "order_id", "item_id", "seller_id", "buyer_id", "meetup_location",
  "trade_status", "deal_price", "guarantee_fee", "discount_amount",
  "total_amount", "verify_qr_code", "created_at", "paid_at",
  "completed_at", "cancelled_at"
];
const categories = itemService.CANONICAL_CATEGORIES;

for (const item of itemData.getItems()) {
  requireFields(item, itemFields, item.item_id);
  if (!categories.includes(item.category)) throw new Error(`Bad item category: ${item.item_id}`);
  if (!["全新", "9成新", "良好"].includes(item.condition)) {
    throw new Error(`Bad item condition: ${item.item_id}`);
  }
  if (!["on_sale", "reserved", "sold"].includes(item.status)) {
    throw new Error(`Bad item status: ${item.item_id}`);
  }
}

for (const order of orderData.getOrders()) {
  requireFields(order, orderFields, order.order_id);
  if (!["wait_pay", "wait_meetup", "completed", "cancelled"].includes(order.trade_status)) {
    throw new Error(`Bad order status: ${order.order_id}`);
  }
}

if (itemData.getItems().length < 19) {
  throw new Error("Demo item count is incomplete");
}

const categoryCounts = itemData.getItems().reduce((counts, item) => {
  counts[item.category] = (counts[item.category] || 0) + 1;
  return counts;
}, {});
for (const category of categories) {
  if ((categoryCounts[category] || 0) < 3) {
    throw new Error(`Category too sparse: ${category}`);
  }
}

// Normal-path smoke flow. Reset after execution so this script is order-independent.
itemData.resetItems();
orderData.resetOrders();
favoriteService.resetFavorites([]);
chatService.resetChats();
resetIds();

const app = {
  globalData: {
    isVerified: false,
    userId: "buyer_test",
    sellerId: "seller_001",
    campus: "北京大学"
  }
};

const auth = authService.verifyStudent(app, {
  email: "student@pku.edu.cn",
  code: "123456"
});
if (!auth.ok || !app.globalData.isVerified) {
  throw new Error("Student verification failed");
}

const published = itemService.createDemoItem({
  title: "宿舍台灯 暖光可调节",
  description: "使用一个学期，灯光正常，附带原装电源线。",
  price: 35,
  category: "宿舍神器",
  condition: "良好",
  campus_location: "图书馆南门",
  supports_meetup: true
}, "seller_001");
if (!published.ok) throw new Error("Publish item creation failed");

const favorite = favoriteService.addFavorite(published.data.item_id);
if (!favorite.ok || favoriteService.listFavoriteItems().length !== 1) {
  throw new Error("Favorite state failed");
}

const searchResults = searchService.queryItems({ keyword: "宿舍台灯" });
if (searchResults.length !== 1 || searchResults[0].item_id !== published.data.item_id) {
  throw new Error("Search result identity failed");
}

const order = orderService.createDemoOrder({
  item_id: published.data.item_id,
  buyer_id: "buyer_test",
  deal_price: 30,
  meetup_location: "图书馆南门"
});
if (!order.ok) throw new Error("Order creation failed");

const paid = orderService.payDemoOrder(order.data.order_id);
if (!paid.ok || paid.data.trade_status !== "wait_meetup") {
  throw new Error("Payment state failed");
}

const completed = orderService.completeDemoOrder(order.data.order_id);
if (!completed.ok || completed.data.trade_status !== "completed") {
  throw new Error("Completion state failed");
}

const chatBefore = chatService.getMessages("chat_001").length;
const sent = chatService.sendMessage("chat_001", "Demo 消息");
if (!sent.ok || sent.data.length !== chatBefore + 1) {
  throw new Error("Chat append failed");
}

const seller = sellerService.getSellerView("seller_001");
if (!seller.ok) throw new Error("Seller lookup failed");

itemData.resetItems();
orderData.resetOrders();
favoriteService.resetFavorites();
chatService.resetChats();
resetIds();

console.log("Lin She mini program check passed.");
