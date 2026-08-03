const { getItemById } = require("../../services/items");

Page({
  data: {
    state: "loading",
    item: null,
    offerPrice: "",
    errorMessage: ""
  },

  onLoad(options) {
    const item = getItemById(options.item_id);
    if (!item || item.status !== "on_sale") {
      this.setData({ state: "not-found" });
      return;
    }

    this.setData({
      state: "ready",
      item,
      offerPrice: String(Math.round(item.price * 0.9))
    });
  },

  onPriceInput(event) {
    this.setData({
      offerPrice: event.detail.value,
      errorMessage: ""
    });
  },

  submitOffer() {
    const value = Number(this.data.offerPrice);
    if (!Number.isFinite(value) || value <= 0) {
      this.setData({ errorMessage: "请输入有效出价" });
      return;
    }
    if (value > this.data.item.price) {
      this.setData({ errorMessage: "出价不应高于商品标价" });
      return;
    }

    wx.navigateTo({
      url: `/pages/order/checkout?item_id=${this.data.item.item_id}&offer_price=${value}`
    });
  },

  goBack() {
    wx.navigateBack();
  }
});
