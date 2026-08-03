const app = getApp();
const { getAuthState, requireVerified } = require("../../services/auth");
const { createDemoItem } = require("../../services/items");
const { THEME } = require("../../config/theme");

const CATEGORY_OPTIONS = [
  { label: "教材", value: "教材课本" },
  { label: "数码", value: "电子数码" },
  { label: "宿舍", value: "宿舍神器" },
  { label: "运动", value: "运动装备" },
  { label: "穿搭", value: "时尚穿搭" },
  { label: "乐器", value: "乐器音响" }
];

Page({
  data: {
    isVerified: false,
    brandColor: THEME.brandColor,
    submitting: false,
    categories: CATEGORY_OPTIONS,
    conditions: ["全新", "9成新", "良好"],
    form: {
      title: "",
      description: "",
      price: "",
      category: "教材课本",
      condition: "9成新",
      campus_location: "图书馆南门",
      supports_meetup: true
    },
    errorField: "",
    errorMessage: ""
  },

  onShow() {
    this.setData({ isVerified: getAuthState(app).isVerified });
  },

  goVerify() {
    wx.navigateTo({ url: "/pages/auth/login" });
  },

  clearFieldError(field) {
    if (this.data.errorField === field) {
      this.setData({ errorField: "", errorMessage: "" });
    }
  },

  updateField(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: event.detail.value });
    this.clearFieldError(field);
  },

  selectCategory(event) {
    this.setData({ "form.category": event.currentTarget.dataset.value });
    this.clearFieldError("category");
  },

  selectCondition(event) {
    this.setData({ "form.condition": event.currentTarget.dataset.value });
    this.clearFieldError("condition");
  },

  toggleMeetup(event) {
    this.setData({ "form.supports_meetup": event.detail.value });
  },

  chooseLocation() {
    this.setData({ "form.campus_location": "图书馆南门" });
    this.clearFieldError("campus_location");
    wx.showToast({ title: "已选择 Demo 面交地点", icon: "none" });
  },

  showImageNotice() {
    wx.showToast({ title: "图片选择为演示占位，不会上传", icon: "none" });
  },

  submit() {
    if (this.data.submitting) return;

    const auth = requireVerified(app);
    if (!auth.ok) {
      wx.navigateTo({ url: auth.redirect });
      return;
    }

    this.setData({
      submitting: true,
      errorField: "",
      errorMessage: ""
    });

    const result = createDemoItem({
      ...this.data.form,
      images: [{ src: "", emoji: "物" }]
    }, app.globalData.sellerId || "seller_001");

    if (!result.ok) {
      this.setData({
        submitting: false,
        errorField: result.error.details.field || "",
        errorMessage: result.error.message
      });
      wx.showToast({ title: result.error.message, icon: "none" });
      return;
    }

    wx.navigateTo({
      url: `/pages/publish/success?item_id=${result.data.item_id}`,
      complete: () => this.setData({ submitting: false })
    });
  }
});
