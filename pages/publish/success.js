Page({
  data: {
    item: {
      emoji: "📚",
      title: "高数考研全套复习资料",
      price: 35,
      status: "已上架"
    }
  },
  goBack() {
    wx.switchTab({ url: "/pages/index/index" });
  },
  shareItem() {
    wx.showToast({ title: "已生成分享卡片", icon: "success" });
  },
  viewMine() {
    wx.switchTab({ url: "/pages/profile/index" });
  }
});
