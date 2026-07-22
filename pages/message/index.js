const { getChats } = require("../../services/chats");

Page({
  data: {
    chats: [],
    allChats: [],
    keyword: ""
  },
  onLoad() {
    const chats = getChats();
    this.setData({ chats, allChats: chats });
  },
  onSearchInput(event) {
    const keyword = (event.detail.value || "").trim();
    const chats = this.data.allChats.filter((chat) => {
      return [chat.name, chat.last, chat.goods].some((value) => String(value).includes(keyword));
    });
    this.setData({
      keyword,
      chats: keyword ? chats : this.data.allChats
    });
  },
  openChat(event) {
    const id = event.currentTarget.dataset.id || "chat_001";
    wx.navigateTo({ url: `/pages/message/chat?chat_id=${id}` });
  },
  createChat() {
    wx.showToast({
      title: "请选择商品后发起会话",
      icon: "none"
    });
  }
});
