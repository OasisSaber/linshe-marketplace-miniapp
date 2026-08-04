const app = getApp();
const { requireVerified } = require("../../services/auth");
const {
  getCheckoutQuote,
  createAndPayDemoOrder
} = require("../../services/checkout");

Page({
  data: {
    state: "loading",
    item: null,
    meetupLocation: "",
    dealPrice: 0,
    guaranteeFee: 0,
    discountAmount: 0,
    total: 0,
    submitting: false,
    errorMessage: ""
  },

  onLoad(options) {
    const quote = getCheckoutQuote(options.item_id, options.offer_price);
    if (!quote.ok) {
      const stateByCode = {
        ITEM_NOT_FOUND: "not-found",
        ITEM_NOT_AVAILABLE: "unavailable",
        OFFER_PRICE_INVALID: "invalid-offer"
      };
      this.setData({
        state: stateByCode[quote.error.code] || "error",
        errorMessage: quote.error.message
      });
      return;
    }

    this.setData({
      state: "ready",
      ...quote.data
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

    const paid = createAndPayDemoOrder({
      item_id: this.data.item.item_id,
      buyer_id: app.globalData.userId,
      meetup_location: this.data.meetupLocation,
      deal_price: this.data.dealPrice,
      guarantee_fee: this.data.guaranteeFee,
      discount_amount: this.data.discountAmount
    });

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
