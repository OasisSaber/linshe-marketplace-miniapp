const test = require("node:test");
const assert = require("node:assert/strict");

const data = require("../data/items");
const favorites = require("../services/favorites");

test.beforeEach(() => {
  data.resetItems();
  favorites.resetFavorites([]);
});

test("favorite add/remove uses one shared state", () => {
  assert.equal(favorites.isFavorite("item_001"), false);
  assert.equal(favorites.addFavorite("item_001").ok, true);
  assert.equal(favorites.isFavorite("item_001"), true);
  assert.deepEqual(
    favorites.listFavoriteItems().map((item) => item.item_id),
    ["item_001"]
  );

  favorites.removeFavorite("item_001");
  assert.equal(favorites.isFavorite("item_001"), false);
});

test("invalid item cannot be favorited", () => {
  const result = favorites.addFavorite("missing");
  assert.equal(result.ok, false);
  assert.equal(favorites.listFavoriteItems().length, 0);
});


test("invalid item cannot be removed from favorites", () => {
  const result = favorites.removeFavorite("missing");
  assert.equal(result.ok, false);
  assert.equal(result.error.code, "ITEM_NOT_FOUND");
});
