Page({
  data: {
    locations: [
      { icon: "📚", title: "中央图书馆 一层大厅", desc: "人流密集 · 有监控" },
      { icon: "🏛️", title: "东区学生活动中心门口", desc: "公共开放 · 光线充足" },
      { icon: "📦", title: "南门菜鸟驿站旁", desc: "保安值守 · 推荐" }
    ],
    guides: ["如何识别二手交易骗局", "校内交易安全须知", "紧急联系与求助电话"],
    reported: false
  },
  goBack() {
    wx.navigateBack();
  },
  report() {
    this.setData({ reported: true });
    wx.showToast({ title: "Demo 反馈已提交", icon: "success" });
  }
});
