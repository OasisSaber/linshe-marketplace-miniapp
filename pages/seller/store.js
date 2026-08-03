const { getSellerView } = require("../../services/sellers");

Page({
  data: {
    state: "loading",
    seller: null,
    items: [],
    stats: null,
    followed: false
  },

  onLoad(options) {
    const result = getSellerView(options.seller_id);
    if (!result.ok) {
      this.setData({ state: "not-found" });
      return;
    }

    this.setData({
      state: "ready",
      ...result.data
    });
  },

  toggleFollow() {
    this.setData({ followed: !this.data.followed });
    wx.showToast({
      title: this.data.followed ? "已关注" : "已取消关注",
      icon: "none"
    });
  },

  openItem(event) {
    wx.navigateTo({
      url: `/pages/goods/detail?item_id=${event.currentTarget.dataset.id}`
    });
  },

  goBack() {
    wx.navigateBack();
  }
});
