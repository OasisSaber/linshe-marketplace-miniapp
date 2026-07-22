const app = getApp();
const { getAuthState, requireVerified } = require("../../services/auth");
const { createDemoItem } = require("../../services/items");

Page({
  data: {
    isVerified: false,
    categories: ["教材", "数码", "家居", "服饰", "运动", "乐器", "其他"],
    activeCategory: "教材",
    conditions: ["全新", "9成新", "良好"],
    activeCondition: "9成新",
    form: {
      title: "",
      price: "",
      condition: "良好",
      campus_location: ""
    }
  },
  onShow() {
    this.setData({ isVerified: getAuthState(app).isVerified });
  },
  goVerify() {
    wx.navigateTo({ url: "/pages/auth/login" });
  },
  selectCategory(event) {
    this.setData({ activeCategory: event.currentTarget.dataset.value });
  },
  selectCondition(event) {
    this.setData({ activeCondition: event.currentTarget.dataset.value });
  },
  onTitleInput(event) {
    this.setData({ "form.title": event.detail.value });
  },
  onPriceInput(event) {
    this.setData({ "form.price": event.detail.value });
  },
  submit() {
    const auth = requireVerified(app);
    if (!auth.ok) {
      wx.navigateTo({ url: auth.redirect });
      return;
    }
    createDemoItem({
      title: this.data.form.title,
      price: this.data.form.price || 88,
      condition: this.data.activeCondition,
      campus_location: this.data.form.campus_location || "图书馆南门 100米"
    }, "seller_demo");
    wx.navigateTo({ url: "/pages/publish/success" });
  }
});
