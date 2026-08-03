const { getItemById, listItems } = require("./items");
const { success, failure } = require("./result");

const favoriteIds = new Set(["item_001", "item_003"]);

function isFavorite(itemId) {
  return favoriteIds.has(itemId);
}

function listFavoriteIds() {
  return Array.from(favoriteIds);
}

function listFavoriteItems() {
  return listItems().filter((item) => favoriteIds.has(item.item_id));
}

function addFavorite(itemId) {
  const item = getItemById(itemId);
  if (!item) return failure("ITEM_NOT_FOUND", "商品不存在");
  favoriteIds.add(itemId);
  return success({ itemId, favorite: true });
}

function removeFavorite(itemId) {
  const item = getItemById(itemId);
  if (!item) return failure("ITEM_NOT_FOUND", "商品不存在");
  favoriteIds.delete(itemId);
  return success({ itemId, favorite: false });
}

function toggleFavorite(itemId) {
  return isFavorite(itemId) ? removeFavorite(itemId) : addFavorite(itemId);
}

function resetFavorites(ids) {
  favoriteIds.clear();
  for (const itemId of ids || ["item_001", "item_003"]) {
    favoriteIds.add(itemId);
  }
}

module.exports = {
  isFavorite,
  listFavoriteIds,
  listFavoriteItems,
  addFavorite,
  removeFavorite,
  toggleFavorite,
  resetFavorites
};
