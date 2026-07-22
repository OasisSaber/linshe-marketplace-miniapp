const app = getApp();
const { getItemById } = require("../../services/items");
const { requireVerified } = require("../../services/auth");
const { createDemoOrder, payDemoOrder } = require("../../services/orders");

Page({
  data: {
    item: null,
    meetupLocation: "北大图书馆南门",
    feeRows: [],
    dealPrice: 0,
    total: 0
  },
  onLoad(options) {
    const item = getItemById(options.item_id || "item_003");
    const offerPrice = Number(options.offer_price || item.price);
    const dealPrice = Number.isFinite(offerPrice) && offerPrice > 0 ? offerPrice : item.price;
    const guaranteeFee = 2;
    const meetupDiscount = 2;
    this.setData({
      item,
      meetupLocation: "北大图书馆南门",
      feeRows: [
        { label: "商品总价", value: `¥${dealPrice}`, highlight: false },
        { label: "平台担保费", value: `¥${guaranteeFee}.00`, highlight: false },
        { label: "校园面交优惠", value: `-¥${meetupDiscount}.00`, highlight: true }
      ],
      dealPrice,
      total: dealPrice + guaranteeFee - meetupDiscount
    });
  },
  goBack() {
    wx.navigateBack();
  },
  chooseLocation() {
    this.setData({ meetupLocation: "北大图书馆南门" });
  },
  pay() {
    const auth = requireVerified(app);
    if (!auth.ok) {
      wx.navigateTo({ url: auth.redirect });
      return;
    }
    const order = createDemoOrder({
      item_id: this.data.item.item_id,
      buyer_id: app.globalData.userId,
      meetup_location: this.data.meetupLocation
    });
    payDemoOrder(order.order_id);
    wx.showToast({ title: "Demo 支付已通过", icon: "success" });
    setTimeout(() => {
      wx.navigateTo({ url: `/pages/order/detail?order_id=${order.order_id}` });
    }, 300);
  }
});
