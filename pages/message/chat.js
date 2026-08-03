const { getChatById, getMessages, sendMessage } = require("../../services/chats");
const { getItemById } = require("../../services/items");

Page({
  data: {
    state: "loading",
    chatId: "",
    peer: null,
    item: null,
    messages: [],
    draft: "",
    errorMessage: ""
  },

  onLoad(options) {
    const chat = getChatById(options.chat_id);
    if (!chat) {
      this.setData({ state: "not-found" });
      return;
    }

    const item = getItemById(chat.item_id);
    const messages = getMessages(chat.id);
    if (!item || !messages) {
      this.setData({ state: "not-found" });
      return;
    }

    this.setData({
      state: "ready",
      chatId: chat.id,
      peer: {
        name: chat.name,
        avatar: chat.avatar,
        status: "学生认证 · Demo 在线"
      },
      item,
      messages
    });
  },

  onInput(event) {
    this.setData({ draft: event.detail.value, errorMessage: "" });
  },

  sendMessage() {
    const result = sendMessage(this.data.chatId, this.data.draft);
    if (!result.ok) {
      this.setData({ errorMessage: result.error.message });
      return;
    }

    this.setData({
      messages: result.data,
      draft: ""
    });
  },

  openOffer() {
    if (!this.data.item) return;
    wx.navigateTo({
      url: `/pages/goods/offer?item_id=${this.data.item.item_id}`
    });
  },

  buyNow() {
    if (!this.data.item) return;
    if (this.data.item.status !== "on_sale") {
      wx.showToast({ title: "商品当前不可购买", icon: "none" });
      return;
    }
    wx.navigateTo({
      url: `/pages/order/checkout?item_id=${this.data.item.item_id}`
    });
  },

  goBack() {
    wx.navigateBack();
  }
});
