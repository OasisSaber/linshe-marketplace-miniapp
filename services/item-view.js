const { getItemById, ITEM_STATUS_LABELS } = require("./items");
const { isFavorite } = require("./favorites");
const { getSellerView } = require("./sellers");
const { success, failure } = require("./result");

const AVAILABILITY = {
  on_sale: {
    tone: "positive",
    title: "商品可交易",
    description: "可向卖家出价，并在校内公共区域完成当面验货。",
    primaryActionLabel: "出价购买"
  },
  reserved: {
    tone: "warning",
    title: "商品交易中",
    description: "该商品已有进行中的订单，暂时不能再次出价。",
    primaryActionLabel: "商品交易中"
  },
  sold: {
    tone: "neutral",
    title: "商品已售出",
    description: "该商品已完成交易，可返回首页查看其他校园闲置。",
    primaryActionLabel: "商品已售出"
  }
};

function getItemDetailView(itemId) {
  const item = getItemById(itemId);
  if (!item) {
    return failure("ITEM_NOT_FOUND", "商品不存在", { itemId });
  }

  const sellerResult = getSellerView(item.seller_id);
  const availability = AVAILABILITY[item.status] || {
    tone: "neutral",
    title: "商品状态未知",
    description: "当前商品状态暂不可用，请返回列表刷新后重试。",
    primaryActionLabel: "暂不可交易"
  };

  return success({
    item,
    seller: sellerResult.ok ? sellerResult.data.seller : null,
    favorited: isFavorite(item.item_id),
    statusLabel: ITEM_STATUS_LABELS[item.status] || item.status,
    availability
  });
}

module.exports = {
  AVAILABILITY,
  getItemDetailView
};
