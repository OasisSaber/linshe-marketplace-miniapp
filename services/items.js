const { getItems, getItemById } = require("../data/items");
const { getSellerById } = require("../data/sellers");
const { createId } = require("./id");
const { success, failure } = require("./result");

const CANONICAL_CATEGORIES = [
  "教材课本",
  "电子数码",
  "宿舍神器",
  "运动装备",
  "时尚穿搭",
  "乐器音响"
];

const CATEGORY_ALIASES = {
  教材: "教材课本",
  数码: "电子数码",
  家居: "宿舍神器",
  服饰: "时尚穿搭",
  运动: "运动装备",
  乐器: "乐器音响"
};

const ALLOWED_CONDITIONS = ["全新", "9成新", "良好"];
const ALLOWED_STATUSES = ["on_sale", "reserved", "sold"];
const ITEM_STATUS_LABELS = {
  on_sale: "可交易",
  reserved: "交易中",
  sold: "已售出"
};

function listItems() {
  return getItems();
}

function normalizeCategory(value) {
  if (CANONICAL_CATEGORIES.includes(value)) return value;
  return CATEGORY_ALIASES[value] || null;
}

function searchItems(keyword) {
  const text = String(keyword || "").trim().toLowerCase();
  if (!text) return listItems();

  return listItems().filter((item) => {
    return item.title.toLowerCase().includes(text)
      || item.campus_location.toLowerCase().includes(text);
  });
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function invalid(code, message, field) {
  return failure(code, message, { field });
}

function validateItemPayload(payload) {
  const title = String(payload.title || "").trim();
  const description = String(payload.description || "").trim();
  const price = Number(payload.price);
  const originalPrice = payload.original_price == null || payload.original_price === ""
    ? price
    : Number(payload.original_price);
  const category = normalizeCategory(payload.category);
  const condition = ALLOWED_CONDITIONS.includes(payload.condition)
    ? payload.condition
    : null;
  const campusLocation = String(payload.campus_location || "").trim();

  if (title.length < 5 || title.length > 30) {
    return invalid("ITEM_TITLE_INVALID", "商品标题需为 5–30 字", "title");
  }
  if (description.length < 10) {
    return invalid("ITEM_DESCRIPTION_INVALID", "商品描述至少需要 10 字", "description");
  }
  const normalizedPrice = Number.isFinite(price) ? roundMoney(price) : NaN;
  const normalizedOriginalPrice = Number.isFinite(originalPrice)
    ? roundMoney(originalPrice)
    : NaN;

  if (!Number.isFinite(price) || price <= 0 || price > 999999 || normalizedPrice <= 0) {
    return invalid("ITEM_PRICE_INVALID", "价格至少为 0.01 且不超过 999999", "price");
  }
  if (!Number.isFinite(originalPrice) || originalPrice <= 0 || normalizedOriginalPrice <= 0) {
    return invalid("ITEM_ORIGINAL_PRICE_INVALID", "原价至少为 0.01", "original_price");
  }
  if (!category) {
    return invalid("ITEM_CATEGORY_INVALID", "请选择有效商品分类", "category");
  }
  if (!condition) {
    return invalid("ITEM_CONDITION_INVALID", "请选择有效成色", "condition");
  }
  if (!campusLocation) {
    return invalid("ITEM_LOCATION_REQUIRED", "请选择校内面交地点", "campus_location");
  }

  return success({
    title,
    description,
    price: normalizedPrice,
    original_price: normalizedOriginalPrice,
    category,
    condition,
    campus_location: campusLocation,
    supports_meetup: payload.supports_meetup !== false
  });
}

function createDemoItem(payload, sellerId) {
  const validated = validateItemPayload(payload || {});
  if (!validated.ok) return validated;

  const resolvedSellerId = sellerId || "seller_001";
  if (!getSellerById(resolvedSellerId)) {
    return failure("SELLER_NOT_FOUND", "发布账号未关联有效卖家档案", {
      sellerId: resolvedSellerId
    });
  }

  const value = validated.data;
  const item = {
    item_id: createId("item"),
    seller_id: resolvedSellerId,
    title: value.title,
    description: value.description,
    price: value.price,
    original_price: value.original_price,
    images: Array.isArray(payload.images) && payload.images.length
      ? payload.images
      : [{ src: "", emoji: "物" }],
    category: value.category,
    condition: value.condition,
    campus_location: value.campus_location,
    supports_meetup: value.supports_meetup,
    status: "on_sale",
    created_at: new Date().toISOString()
  };

  getItems().unshift(item);
  return success(item);
}

function updateItemStatus(itemId, nextStatus) {
  const item = getItemById(itemId);
  if (!item) {
    return failure("ITEM_NOT_FOUND", "商品不存在", { itemId });
  }
  if (!ALLOWED_STATUSES.includes(nextStatus)) {
    return failure("ITEM_STATUS_INVALID", "无效商品状态", { nextStatus });
  }

  item.status = nextStatus;
  return success(item);
}

module.exports = {
  CANONICAL_CATEGORIES,
  ITEM_STATUS_LABELS,
  listItems,
  searchItems,
  getItemById,
  normalizeCategory,
  validateItemPayload,
  createDemoItem,
  updateItemStatus
};
