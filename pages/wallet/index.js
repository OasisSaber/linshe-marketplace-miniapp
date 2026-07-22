Page({
  data: {
    balance: "1,365.00",
    stats: [
      { value: "¥2,168", label: "累计收入" },
      { value: "¥803", label: "累计支出" },
      { value: "320", label: "环保积分" }
    ],
    bills: [
      { id: "b_001", type: "in", title: "卖出「考研数学辅导书」", time: "06-18 14:22", amount: "+45.00" },
      { id: "b_002", type: "out", title: "提现到微信零钱", time: "06-15 09:10", amount: "-200.00" },
      { id: "b_003", type: "in", title: "卖出「索尼降噪耳机」", time: "06-12 20:45", amount: "+1280.00" },
      { id: "b_004", type: "out", title: "购买「人体工学学习椅」", time: "06-09 16:30", amount: "-180.00" },
      { id: "b_005", type: "in", title: "卖出「捷安特自行车」", time: "06-05 11:08", amount: "+420.00" }
    ]
  },
  goBack() {
    wx.navigateBack();
  },
  withdraw() {
    wx.showToast({ title: "Demo 提现申请已提交", icon: "none" });
  },
  recharge() {
    wx.showToast({ title: "Demo 充值已自动通过", icon: "success" });
  }
});
