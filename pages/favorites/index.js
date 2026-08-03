const {
  listFavoriteItems,
  removeFavorite
} = require("../../services/favorites");

Page({
  data: {
    items: []
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
    removeFavorite(itemId);
    this.refresh();
    wx.showToast({ title: "已取消收藏", icon: "none" });
  },

  goShopping() {
    wx.switchTab({ url: "/pages/index/index" });
  }
});
