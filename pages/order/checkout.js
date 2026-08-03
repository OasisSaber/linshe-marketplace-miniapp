const app = getApp();
const { getItemById } = require("../../services/items");
const { requireVerified } = require("../../services/auth");
const { createDemoOrder, payDemoOrder } = require("../../services/orders");

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

Page({
  data: {
    state: "loading",
    item: null,
    meetupLocation: "北大图书馆南门",
    dealPrice: 0,
    guaranteeFee: 2,
    discountAmount: 2,
    total: 0,
    submitting: false,
    errorMessage: ""
  },

  onLoad(options) {
    const item = getItemById(options.item_id);
    if (!item) {
      this.setData({ state: "not-found" });
      return;
    }
    if (item.status !== "on_sale") {
      this.setData({ state: "unavailable", item });
      return;
    }

    const offerPrice = Number(options.offer_price || item.price);
    const dealPrice = Number.isFinite(offerPrice) && offerPrice > 0
      ? offerPrice
      : item.price;

    this.setData({
      state: "ready",
      item,
      dealPrice,
      total: roundMoney(dealPrice + roundMoney(this.data.guaranteeFee) - roundMoney(this.data.discountAmount))
    });
  },

  pay() {
    if (this.data.submitting || this.data.state !== "ready") return;

    const auth = requireVerified(app);
    if (!auth.ok) {
      wx.navigateTo({ url: auth.redirect });
      return;
    }

    this.setData({ submitting: true, errorMessage: "" });

    const created = createDemoOrder({
      item_id: this.data.item.item_id,
      buyer_id: app.globalData.userId,
      meetup_location: this.data.meetupLocation,
      deal_price: this.data.dealPrice,
      guarantee_fee: this.data.guaranteeFee,
      discount_amount: this.data.discountAmount
    });

    if (!created.ok) {
      this.setData({
        submitting: false,
        errorMessage: created.error.message
      });
      return;
    }

    const paid = payDemoOrder(created.data.order_id);
    if (!paid.ok) {
      this.setData({
        submitting: false,
        errorMessage: paid.error.message
      });
      return;
    }

    wx.navigateTo({
      url: `/pages/order/detail?order_id=${paid.data.order_id}`,
      complete: () => this.setData({ submitting: false })
    });
  },

  goBack() {
    wx.navigateBack();
  }
});
