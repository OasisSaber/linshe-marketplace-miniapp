const { getChatById, getMessages, sendMessage } = require("../../services/chats");
const { getItemById } = require("../../services/items");

Page({
  data: {
    chatId: "chat_001",
    peer: {
      name: "李同学",
      avatar: "李",
      status: "学生认证 · 在线"
    },
    item: {
      emoji: "🧹",
      title: "戴森 V8 无线吸尘器",
      price: 650
    },
    messages: [
      { id: "m_001", side: "time", text: "今天 14:30" },
      { id: "m_002", side: "peer", text: "你好！请问这个吸尘器现在还在吗？" },
      { id: "m_003", side: "me", text: "在的，品相很好，基本没怎么用" },
      { id: "m_004", side: "peer", text: "请问可以便宜一点吗？能不能 600？" },
      { id: "m_005", side: "me", text: "最低 630 了，你看可以吗" },
      { id: "m_006", side: "peer", text: "好吧，630 就 630，那我们什么时候可以见面？" },
      { id: "m_007", side: "me", text: "明天下午3点，图书馆南门，方便吗？" },
      { id: "m_008", side: "peer", text: "可以！明天见 👍" }
    ],
    draft: ""
  },
  onLoad(options) {
    const chatId = options.chat_id || "chat_001";
    const chat = getChatById(chatId);
    const item = getItemById(chat.item_id);
    this.setData({
      chatId,
      peer: {
        name: chat.name,
        avatar: chat.avatar,
        status: "学生认证 · 在线"
      },
      item: {
        item_id: item.item_id,
        emoji: chat.goods,
        title: item.title,
        price: item.price
      },
      messages: getMessages(chatId)
    });
  },
  goBack() {
    wx.navigateBack();
  },
  openOffer() {
    wx.navigateTo({ url: `/pages/goods/offer?item_id=${this.data.item.item_id}` });
  },
  buyNow() {
    wx.navigateTo({ url: `/pages/order/checkout?item_id=${this.data.item.item_id}` });
  },
  callPeer() {
    wx.showToast({ title: "Demo 已发起校内电话提醒", icon: "none" });
  },
  openMore() {
    wx.showToast({ title: "已打开会话设置 Demo", icon: "none" });
  },
  openTools() {
    wx.showToast({ title: "Demo 可发送图片或位置", icon: "none" });
  },
  onInput(event) {
    this.setData({ draft: event.detail.value });
  },
  sendMessage() {
    const text = this.data.draft.trim();
    if (!text) return;
    this.setData({ messages: sendMessage(this.data.chatId, text), draft: "" });
  }
});
