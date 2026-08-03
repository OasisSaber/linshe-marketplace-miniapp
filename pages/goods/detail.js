const app = getApp();
const { getItemById, ITEM_STATUS_LABELS } = require("../../services/items");
const { getChatByItemId } = require("../../services/chats");
const { requireVerified } = require("../../services/auth");
const {
  isFavorite,
  toggleFavorite
} = require("../../services/favorites");
const { getSellerView } = require("../../services/sellers");

Page({
  data: {
    state: "loading",
    item: null,
    seller: null,
    favorited: false,
    statusLabel: ""
  },

  onLoad(options) {
    const item = getItemById(options.item_id);
    if (!item) {
      this.setData({ state: "not-found" });
      return;
    }

    const sellerResult = getSellerView(item.seller_id);
    this.setData({
      state: "ready",
      item,
      seller: sellerResult.ok ? sellerResult.data.seller : null,
      favorited: isFavorite(item.item_id),
      statusLabel: ITEM_STATUS_LABELS[item.status] || item.status
    });
  },

  onShow() {
    if (this.data.item) {
      this.setData({ favorited: isFavorite(this.data.item.item_id) });
    }
  },

  toggleFavorite() {
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
    if (this.data.item.status !== "on_sale") {
      wx.showToast({ title: "商品当前不可出价", icon: "none" });
      return;
    }
    wx.navigateTo({
      url: `/pages/goods/offer?item_id=${this.data.item.item_id}`
    });
  },

  openSeller() {
    wx.navigateTo({
      url: `/pages/seller/store?seller_id=${this.data.item.seller_id}`
    });
  },

  goBack() {
    wx.navigateBack();
  }
});
