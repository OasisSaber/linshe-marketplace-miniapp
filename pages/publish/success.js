const { getItemById } = require("../../services/items");

Page({
  data: {
    state: "loading",
    item: null
  },

  onLoad(options) {
    const item = getItemById(options.item_id);
    this.setData({
      state: item ? "ready" : "not-found",
      item
    });
  },

  goHome() {
    wx.switchTab({ url: "/pages/index/index" });
  },

  openItem() {
    if (!this.data.item) return;
    wx.redirectTo({
      url: `/pages/goods/detail?item_id=${this.data.item.item_id}`
    });
  }
});
