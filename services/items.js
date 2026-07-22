const { getItems, getItemById } = require("../data/items");

function listItems() {
  return getItems();
}

function searchItems(keyword) {
  const text = (keyword || "").trim();
  if (!text) return listItems();
  return listItems().filter((item) => item.title.includes(text));
}

function createDemoItem(payload, sellerId) {
  const title = (payload.title || "校园闲置物品").trim();
  const price = Number(payload.price || 0);
  const allowedConditions = ["全新", "9成新", "良好"];
  const condition = allowedConditions.includes(payload.condition) ? payload.condition : "良好";
  const item = {
    item_id: `item_demo_${Date.now()}`,
    seller_id: sellerId || "seller_demo",
    title,
    price,
    original_price: Number(payload.original_price || price),
    images: payload.images || ["📚"],
    category: payload.category || "教材课本",
    condition,
    campus_location: payload.campus_location || "图书馆南门 100米",
    status: "on_sale"
  };

  getItems().unshift(item);
  return item;
}

function getFavoriteItems() {
  return listItems().slice(0, 3).map((item, index) => ({
    id: `fav_${item.item_id}`,
    item_id: item.item_id,
    emoji: item.images[0],
    title: item.title,
    price: item.price,
    originalPrice: item.original_price,
    tag: index === 0 ? "↓ 降价" : "",
    location: item.campus_location
  }));
}

module.exports = {
  listItems,
  searchItems,
  getItemById,
  createDemoItem,
  getFavoriteItems
};
