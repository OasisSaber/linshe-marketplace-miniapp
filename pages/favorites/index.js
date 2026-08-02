const { getFavoriteItems } = require("../../services/items");

Page({
  data: {
    activeTab: "商品",
    tabs: ["商品", "帖子"],
    items: []
  },
  onLoad() {
    this.setData({ items: getFavoriteItems() });
  },
  goBack() {
    wx.navigateBack();
  },
  setTab(event) {
    this.setData({ activeTab: event.currentTarget.dataset.tab });
  },
  openDetail(event) {
    const itemId = event.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/goods/detail?item_id=${itemId}` });
  },
  removeFavorite() {
    wx.showToast({ title: "已取消收藏", icon: "none" });
  },
  goShopping() {
    wx.switchTab({ url: "/pages/index/index" });
  }
});
