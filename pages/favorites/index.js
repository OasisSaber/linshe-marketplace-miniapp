const {
  listFavoriteItems,
  removeFavorite
} = require("../../services/favorites");

Page({
  data: {
    items: [],
    removingId: "",
    errorMessage: ""
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    this.setData({ items: listFavoriteItems() });
  },

  openDetail(event) {
    wx.navigateTo({
      url: `/pages/goods/detail?item_id=${event.currentTarget.dataset.id}`
    });
  },

  removeFavorite(event) {
    const itemId = event.currentTarget.dataset.id;
    if (!itemId || this.data.removingId) return;

    this.setData({ removingId: itemId, errorMessage: "" });
    const result = removeFavorite(itemId);

    if (!result.ok) {
      this.setData({
        removingId: "",
        errorMessage: result.error.message
      });
      wx.showToast({ title: result.error.message, icon: "none" });
      return;
    }

    this.refresh();
    this.setData({ removingId: "" });
    wx.showToast({ title: "已取消收藏", icon: "none" });
  },

  goShopping() {
    wx.switchTab({ url: "/pages/index/index" });
  }
});
