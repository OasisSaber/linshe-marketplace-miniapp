const app = getApp();
const { verifyStudent } = require("../../services/auth");

Page({
  data: {
    step: "login",
    agreed: false,
    email: "",
    code: ""
  },
  toggleAgree() {
    this.setData({ agreed: !this.data.agreed });
  },
  startVerify() {
    if (!this.data.agreed) {
      wx.showToast({ title: "请先同意用户协议和隐私政策", icon: "none" });
      return;
    }
    this.setData({ step: "verify" });
  },
  goBack() {
    if (this.data.step === "verify") {
      this.setData({ step: "login" });
      return;
    }
    wx.navigateBack();
  },
  onEmailInput(event) {
    this.setData({ email: event.detail.value });
  },
  onCodeInput(event) {
    this.setData({ code: event.detail.value });
  },
  sendCode() {
    wx.showToast({ title: "验证码已发送", icon: "success" });
  },
  phoneLogin() {
    wx.showToast({ title: "Demo 使用校园邮箱认证登录", icon: "none" });
    this.startVerify();
  },
  uploadCard() {
    wx.showToast({ title: "Demo 已记录学生证材料", icon: "none" });
  },
  submitVerify() {
    const result = verifyStudent(app, {
      email: this.data.email,
      code: this.data.code
    });
    if (!result.ok) {
      wx.showToast({ title: result.message, icon: "none" });
      return;
    }
    wx.showToast({ title: result.message, icon: "success" });
    setTimeout(() => wx.navigateBack(), 500);
  }
});
