Page({
  data: {
    seller: {
      name: "王同学的小铺",
      avatar: "王",
      badge: "信用极好",
      campus: "清华大学 · 经管学院 · 已交易 64 笔"
    },
    stats: [
      { value: "4.9", label: "综合评分", star: true },
      { value: "98%", label: "好评率" },
      { value: "64", label: "在售/已售" }
    ],
    goods: [
      { id: "s_001", emoji: "📐", src: "/images/goods/book.jpg", title: "考研数学辅导书 全新", price: 45 },
      { id: "s_002", emoji: "🧴", src: "", title: "宿舍小型加湿器", price: 39 },
      { id: "s_003", emoji: "👟", src: "", title: "Nike 跑鞋 42码 九成新", price: 260 },
      { id: "s_004", emoji: "🪑", src: "/images/goods/desk.jpg", title: "人体工学学习椅", price: 180 }
    ]
  },
  goBack() {
    wx.navigateBack();
  },
  message() {
    wx.switchTab({ url: "/pages/message/index" });
  },
  follow() {
    wx.showToast({ title: "已关注店铺", icon: "success" });
  }
});
