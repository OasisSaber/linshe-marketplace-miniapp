const { getSellerById } = require("../data/sellers");
const { listItems } = require("./items");
const { success, failure } = require("./result");

function getSellerView(sellerId) {
  const seller = getSellerById(sellerId);
  if (!seller) {
    return failure("SELLER_NOT_FOUND", "卖家不存在", { sellerId });
  }

  const items = listItems().filter((item) => item.seller_id === sellerId);
  return success({
    seller,
    items,
    stats: {
      active: items.filter((item) => item.status === "on_sale").length,
      sold: items.filter((item) => item.status === "sold").length,
      completedTrades: seller.completed_trades
    }
  });
}

module.exports = {
  getSellerView
};
