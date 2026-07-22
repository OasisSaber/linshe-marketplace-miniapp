const { getItemById } = require("../../services/items");

Page({
  data: {
    item: null,
    offerPrice: "580",
    sellerPrice: 650,
    favorited: false
  },
  onLoad(options) {
    const item = getItemById(options.item_id || "item_003");
    this.setData({
      item,
      sellerPrice: item.price,
      offerPrice: String(Math.round(item.price * 0.9))
    });
  },
  goBack() {
    wx.navigateBack();
  },
  onPriceInput(event) {
    this.setData({ offerPrice: event.detail.value });
  },
  toggleFavorite() {
    this.setData({ favorited: !this.data.favorited });
    wx.showToast({ title: this.data.favorited ? "已收藏" : "已取消收藏", icon: "success" });
  },
  submitOffer() {
    wx.navigateTo({
      url: `/pages/order/checkout?item_id=${this.data.item.item_id}&offer_price=${this.data.offerPrice}`
    });
  }
});
