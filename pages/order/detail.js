const { completeDemoOrder, getOrderView } = require("../../services/orders");
const { getChatByItemId } = require("../../services/chats");

Page({
  data: {
    order: null,
    item: null,
    verified: false,
    timeline: [
      { title: "订单已创建", time: "2024-03-15 10:23", state: "done" },
      { title: "卖家已确认", time: "2024-03-15 10:45", state: "done" },
      { title: "等待校内面交", time: "预计今天下午 3:00", state: "current" },
      { title: "交易完成", time: "等待双方确认", state: "" }
    ]
  },
  onLoad(options) {
    this.setData(getOrderView(options.order_id));
  },
  verify() {
    const order = completeDemoOrder(this.data.order.order_id);
    this.setData(getOrderView(order.order_id));
    wx.showToast({ title: "Demo 核销已通过", icon: "success" });
  },
  contactSeller() {
    const chat = getChatByItemId(this.data.item.item_id);
    wx.navigateTo({ url: `/pages/message/chat?chat_id=${chat.id}` });
  }
});
