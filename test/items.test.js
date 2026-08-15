const { test } = require("node:test");
const assert = require("node:assert/strict");

const itemsService = require("../services/items");
const { getItems } = require("../data/items");

// NOTE: run before createDemoItem tests, which mutate the shared catalog
test("getFavoriteItems returns first three with view shape", () => {
  const favs = itemsService.getFavoriteItems();
  assert.equal(favs.length, 3);
  for (const fav of favs) {
    assert.ok(fav.id.startsWith("fav_"));
    assert.ok(fav.item_id);
    assert.ok(fav.emoji);
    assert.ok(fav.title);
    assert.ok(typeof fav.price === "number");
    assert.ok(fav.originalPrice);
    assert.ok(fav.location);
  }
  assert.equal(favs[0].tag, "↓ 降价");
  assert.equal(favs[1].tag, "");
});

test("listItems returns the seeded catalog", () => {
  const items = itemsService.listItems();
  assert.ok(items.length >= 10, "expected at least 10 seeded items");
  for (const item of items) {
    assert.ok(item.item_id, "item must have item_id");
    assert.ok(item.title, "item must have title");
    assert.ok(item.price > 0, "item price must be positive");
    assert.ok(Array.isArray(item.images) && item.images.length > 0, "item must have images");
  }
});

test("searchItems with empty keyword returns all items", () => {
  const all = itemsService.listItems();
  assert.equal(itemsService.searchItems("").length, all.length);
  assert.equal(itemsService.searchItems("   ").length, all.length);
});

test("searchItems filters by title substring", () => {
  const hits = itemsService.searchItems("MacBook");
  assert.ok(hits.length >= 1);
  assert.ok(hits.every((item) => item.title.includes("MacBook")));
});

test("searchItems is case-sensitive like the UI", () => {
  // v0.1.0 uses plain title.includes(text); document the behavior
  assert.equal(itemsService.searchItems("macbook").length, 0);
});

test("getItemById finds a valid item", () => {
  const item = itemsService.getItemById("item_001");
  assert.ok(item);
  assert.equal(item.item_id, "item_001");
  assert.equal(item.seller_id, "seller_001");
});

test("getItemById falls back to first item for unknown id", () => {
  const first = getItems()[0];
  const item = itemsService.getItemById("item_not_exist");
  assert.equal(item.item_id, first.item_id);
});

test("createDemoItem fills defaults and prepends to catalog", () => {
  const before = getItems().length;
  const created = itemsService.createDemoItem({}, "seller_042");
  assert.ok(created.item_id.startsWith("item_demo_"));
  assert.equal(created.seller_id, "seller_042");
  assert.equal(created.title, "校园闲置物品");
  assert.equal(created.price, 0);
  assert.equal(created.original_price, 0);
  assert.equal(created.condition, "良好");
  assert.equal(created.category, "教材课本");
  assert.equal(created.campus_location, "图书馆南门 100米");
  assert.deepEqual(created.images, ["📚"]);
  assert.equal(created.status, "on_sale");
  assert.equal(getItems().length, before + 1);
  assert.equal(getItems()[0].item_id, created.item_id);
});

test("createDemoItem normalizes price and condition", () => {
  const created = itemsService.createDemoItem(
    { title: "  测试商品  ", price: "88.5", original_price: 120, condition: "轻微磨损" },
    "seller_099"
  );
  assert.equal(created.title, "测试商品");
  assert.equal(created.price, 88.5);
  assert.equal(created.original_price, 120);
  assert.equal(created.condition, "良好"); // unknown condition falls back
});

test("createDemoItem keeps allowed condition verbatim", () => {
  const created = itemsService.createDemoItem({ price: 10, condition: "全新" }, "seller_100");
  assert.equal(created.condition, "全新");
});
