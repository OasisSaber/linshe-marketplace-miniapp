const {
  completeDemoOrder,
  cancelDemoOrder,
  getOrderView
} = require("../../services/orders");

Page({
  data: {
    state: "loading",
    order: null,
    item: null,
    timeline: [],
    statusLabel: "",
    errorMessage: "",
    submitting: false
  },

  onLoad(options) {
    this.loadOrder(options.order_id);
  },

  loadOrder(orderId) {
    const result = getOrderView(orderId);
    if (!result.ok) {
      this.setData({ state: "not-found" });
      return;
    }
    this.setData({
      state: "ready",
      ...result.data,
      errorMessage: ""
    });
  },

  complete() {
    this.runTransition(completeDemoOrder);
  },

  cancel() {
    this.runTransition(cancelDemoOrder);
  },

  runTransition(action) {
    if (this.data.submitting || !this.data.order) return;
    this.setData({ submitting: true, errorMessage: "" });

    const result = action(this.data.order.order_id);
    if (!result.ok) {
      this.setData({
        submitting: false,
        errorMessage: result.error.message
      });
      return;
    }

    this.setData({ submitting: false });
    this.loadOrder(result.data.order_id);
  },

  goBack() {
    wx.navigateBack();
  }
});
