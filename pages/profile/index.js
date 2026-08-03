const app = getApp();
const { listFavoriteItems } = require("../../services/favorites");

Page({
  data: {
    isVerified: false,
    stats: [],
    shortcuts: [
      { label: "我的收藏", url: "/pages/favorites/index" },
      { label: "我的订单", url: "/pages/order/detail?order_id=order_001" },
      { label: "我发布的", url: "" },
      { label: "草稿箱", url: "" }
    ]
  },

  onShow() {
    this.setData({
      isVerified: Boolean(app.globalData.isVerified),
      stats: [
        { value: listFavoriteItems().length, label: "收藏" },
        { value: 38, label: "历史" },
        { value: 6, label: "关注" },
        { value: 2, label: "卡券" }
      ]
    });
  },

  goVerify() {
    wx.navigateTo({ url: "/pages/auth/login" });
  },

  openWallet() {
    wx.navigateTo({ url: "/pages/wallet/index" });
  },

  openShortcut(event) {
    const url = event.currentTarget.dataset.url;
    if (!url) {
      wx.showToast({ title: "Demo 功能展示中", icon: "none" });
      return;
    }
    wx.navigateTo({ url });
  },

  openMenu(event) {
    const url = event.currentTarget.dataset.url;
    if (!url) {
      wx.showToast({ title: "Demo 功能展示中", icon: "none" });
      return;
    }
    wx.navigateTo({ url });
  }
});
