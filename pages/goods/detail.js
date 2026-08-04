const app = getApp();
const { getChatByItemId } = require("../../services/chats");
const { requireVerified } = require("../../services/auth");
const { toggleFavorite } = require("../../services/favorites");
const { getItemDetailView } = require("../../services/item-view");

Page({
  data: {
    state: "loading",
    item: null,
    seller: null,
    favorited: false,
    statusLabel: "",
    availability: null
  },

  onLoad(options) {
    this.itemId = options.item_id;
    this.loadItem();
  },

  onShow() {
    if (this.itemId) this.loadItem();
  },

  loadItem() {
    const result = getItemDetailView(this.itemId);
    if (!result.ok) {
      this.setData({
        state: "not-found",
        item: null,
        seller: null,
        availability: null
      });
      return;
    }

    this.setData({
      state: "ready",
      ...result.data
    });
  },

  toggleFavorite() {
    if (!this.data.item) return;

    const result = toggleFavorite(this.data.item.item_id);
    if (!result.ok) {
      wx.showToast({ title: result.error.message, icon: "none" });
      return;
    }
    this.setData({ favorited: result.data.favorite });
    wx.showToast({
      title: result.data.favorite ? "已收藏" : "已取消收藏",
      icon: "none"
    });
  },

  chatSeller() {
    if (!this.data.item) return;

    const chat = getChatByItemId(this.data.item.item_id);
    if (!chat) {
      wx.showToast({ title: "该商品暂无 Demo 会话", icon: "none" });
      return;
    }
    wx.navigateTo({ url: `/pages/message/chat?chat_id=${chat.id}` });
  },

  makeOffer() {
    const auth = requireVerified(app);
    if (!auth.ok) {
      wx.navigateTo({ url: auth.redirect });
      return;
    }
    if (!this.data.item || this.data.item.status !== "on_sale") {
      wx.showToast({ title: "商品当前不可出价", icon: "none" });
      return;
    }
    wx.navigateTo({
      url: `/pages/goods/offer?item_id=${this.data.item.item_id}`
    });
  },

  openSeller() {
    if (!this.data.item) return;
    wx.navigateTo({
      url: `/pages/seller/store?seller_id=${this.data.item.seller_id}`
    });
  },

  goBack() {
    wx.navigateBack();
  }
});
