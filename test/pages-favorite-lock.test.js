const test = require("node:test");
const assert = require("node:assert/strict");

// --- 微信小程序运行时 shim（页面文件依赖 wx / Page / getApp） ---
let toastCount = 0;
global.wx = {
  showToast() {
    toastCount += 1;
  },
  navigateTo() {},
  navigateBack() {},
  switchTab() {}
};

let registeredPage = null;
global.Page = (definition) => {
  registeredPage = definition;
};
global.getApp = () => ({});

function createPageFrom(definition) {
  const instance = Object.create(definition);
  instance.data = JSON.parse(JSON.stringify(definition.data || {}));
  instance.setData = function (patch) {
    Object.assign(this.data, patch);
  };
  return instance;
}

const data = require("../data/items");
const favorites = require("../services/favorites");

// 加载页面模块（在 shim 之后），并捕获各自的 Page 定义
require("../pages/goods/detail");
const detailDefinition = registeredPage;
registeredPage = null;
require("../pages/index/index");
const indexDefinition = registeredPage;

test.beforeEach(() => {
  data.resetItems();
  favorites.resetFavorites([]);
  toastCount = 0;
});

test("detail page ignores rapid repeated taps within the debounce window", () => {
  const page = createPageFrom(detailDefinition);
  page.onLoad({ item_id: "item_001" });
  assert.equal(page.data.item.item_id, "item_001");

  page.toggleFavorite();
  page.toggleFavorite(); // 300ms 窗口内的快速连点应被忽略

  assert.equal(page.data.favorited, true); // 只翻转一次
  assert.equal(page.data.favoriteBusy, false); // busy 标志已复位
  assert.equal(favorites.isFavorite("item_001"), true);
  assert.equal(toastCount, 1); // 只弹一次 toast
});

test("detail page allows the next tap after the debounce window", () => {
  const page = createPageFrom(detailDefinition);
  page.onLoad({ item_id: "item_001" });

  page.toggleFavorite();
  page.lastFavoriteTapAt = Date.now() - 500; // 模拟已过防连点窗口
  page.toggleFavorite();

  assert.equal(page.data.favorited, false); // 第二次点击生效并取消收藏
  assert.equal(favorites.isFavorite("item_001"), false);
  assert.equal(toastCount, 2);
});

test("index page ignores rapid repeated taps within the debounce window", () => {
  const page = createPageFrom(indexDefinition);
  page.onLoad();
  const firstItemId = page.data.items[0].item_id;
  const event = { currentTarget: { dataset: { id: firstItemId } } };

  page.toggleFavorite(event);
  page.toggleFavorite(event); // 300ms 窗口内的快速连点应被忽略

  assert.equal(favorites.isFavorite(firstItemId), true); // 只翻转一次
  assert.equal(page.data.favoriteBusy, false); // busy 标志已复位
  assert.equal(toastCount, 1);
});

test("index page ignores taps without a valid item id", () => {
  const page = createPageFrom(indexDefinition);
  page.onLoad();

  page.toggleFavorite({ currentTarget: { dataset: { id: "" } } });

  assert.equal(toastCount, 0);
  assert.equal(favorites.listFavoriteItems().length, 0);
});
