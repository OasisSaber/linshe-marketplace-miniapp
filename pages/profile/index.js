const app = getApp();
const demoOrderUrl = "/pages/order/detail?order_id=order_001";

Page({
  data: {
    isVerified: false,
    stats: [
      { value: 12, label: "收藏" },
      { value: 38, label: "历史" },
      { value: 6, label: "关注" },
      { value: 2, label: "卡券" }
    ],
    shortcuts: [
      { label: "我发布的", count: 5, url: "" },
      { label: "我的订单", count: 2, url: demoOrderUrl },
      { label: "我买到的", count: 8, url: demoOrderUrl },
      { label: "草稿箱", count: 1, url: "" }
    ],
    menu: [
      { icon: "♙", label: "账号与安全", url: "/pages/safety/index" },
      { icon: "◎", label: "收货地址管理", url: "" },
      { icon: "?", label: "帮助与反馈", url: "" },
      { icon: "i", label: "关于邻舍", url: "" }
    ]
  },
  onShow() {
    this.setData({ isVerified: app.globalData.isVerified });
  },
  goVerify() {
    wx.navigateTo({ url: "/pages/auth/login" });
  },
  openWallet() {
    wx.navigateTo({ url: "/pages/wallet/index" });
  },
  openShortcut(event) {
    const url = event.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({ url });
      return;
    }
    wx.showToast({ title: "Demo 功能展示中", icon: "none" });
  },
  openMenu(event) {
    const url = event.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({ url });
      return;
    }
    wx.showToast({ title: "Demo 功能展示中", icon: "none" });
  }
});
