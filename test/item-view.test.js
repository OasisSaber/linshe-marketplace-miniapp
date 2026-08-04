const test = require("node:test");
const assert = require("node:assert/strict");

const itemsData = require("../data/items");
const favorites = require("../services/favorites");
const { getItemDetailView } = require("../services/item-view");

function reset() {
  itemsData.resetItems();
  favorites.resetFavorites([]);
}

test.beforeEach(reset);

test("item detail view resolves seller, favorite, and availability", () => {
  favorites.addFavorite("item_001");
  const result = getItemDetailView("item_001");

  assert.equal(result.ok, true);
  assert.equal(result.data.item.item_id, "item_001");
  assert.equal(result.data.seller.seller_id, "seller_001");
  assert.equal(result.data.favorited, true);
  assert.equal(result.data.availability.primaryActionLabel, "出价购买");
});

test("item detail view reflects status changes on every read", () => {
  const item = itemsData.getItemById("item_001");
  item.status = "sold";

  const result = getItemDetailView("item_001");
  assert.equal(result.ok, true);
  assert.equal(result.data.statusLabel, "已售出");
  assert.equal(result.data.availability.primaryActionLabel, "商品已售出");
});

test("invalid item detail returns explicit failure", () => {
  const result = getItemDetailView("missing");
  assert.equal(result.ok, false);
  assert.equal(result.error.code, "ITEM_NOT_FOUND");
});
