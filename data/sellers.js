const SELLER_NAMES = [
  "赵同学", "陈同学", "王同学", "林同学", "周同学",
  "刘同学", "孙同学", "吴同学", "郑同学", "许同学",
  "冯同学", "韩同学", "朱同学", "秦同学", "何同学",
  "吕同学", "施同学", "孔同学", "曹同学"
];

const sellers = SELLER_NAMES.map((name, index) => ({
  seller_id: `seller_${String(index + 1).padStart(3, "0")}`,
  name,
  avatar_text: name.slice(0, 1),
  campus: "北京大学",
  college: ["信息科学技术学院", "经济学院", "元培学院", "法学院"][index % 4],
  rating: Number((4.6 + (index % 4) * 0.1).toFixed(1)),
  reputation_score: 92 + (index % 7),
  completed_trades: 8 + index * 3,
  bio: "优先校内安全地点面交，商品情况会在页面如实说明。"
}));

function getSellers() {
  return sellers;
}

function getSellerById(sellerId) {
  if (!sellerId) return null;
  return sellers.find((seller) => seller.seller_id === sellerId) || null;
}

module.exports = {
  getSellers,
  getSellerById
};
