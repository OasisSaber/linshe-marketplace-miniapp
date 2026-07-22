const { getItemById } = require("../../services/items");
const { getChatByItemId } = require("../../services/chats");
const { requireVerified } = require("../../services/auth");
const app = getApp();

const detailMap = {
  item_001: {
    sellerName: "赵同学",
    sellerAvatar: "赵",
    sellerMeta: "★★★★★ 4.8 · 信誉分 96",
    description: "同济版高等数学教材，上下册齐全，重点章节有少量笔记，适合期末复习和考研打基础。",
    meetupLabel: "图书馆南门"
  },
  item_002: {
    sellerName: "陈同学",
    sellerAvatar: "陈",
    sellerMeta: "★★★★★ 4.9 · 信誉分 98",
    description: "MacBook Air M1 深空灰 256G，日常学习办公使用，电池状态良好，机身轻微使用痕迹，充电器可一并提供。",
    meetupLabel: "理科楼大厅"
  },
  item_003: {
    sellerName: "王同学",
    sellerAvatar: "王",
    sellerMeta: "★★★★★ 4.9 · 信誉分 98",
    description: "戴森 V8 正品行货，使用约半年，日常清洁用，功能完好，吸力强劲。所有配件齐全，原包装可提供。",
    meetupLabel: "北大图书馆南门"
  },
  item_004: {
    sellerName: "林同学",
    sellerAvatar: "林",
    sellerMeta: "★★★★★ 4.7 · 信誉分 94",
    description: "宿舍小冰箱 42L，静音节能，适合饮料、水果和便当短期存放，毕业搬宿舍转让。",
    meetupLabel: "燕园食堂门口"
  }
};

const sellerNames = ["赵同学", "陈同学", "王同学", "林同学", "周同学", "刘同学", "孙同学", "吴同学"];
const categoryDescriptions = {
  "教材课本": "课程学习相关闲置，适合期末复习、考研备考或日常预习使用，页内可能有少量学习标注。",
  "电子数码": "校园学习和生活常用数码设备，功能已做 Demo 级检查，适合同校面交时当面确认成色。",
  "宿舍神器": "宿舍生活提效好物，适合搬寝、毕业季或短期周转使用，建议面交时确认尺寸和使用痕迹。",
  "运动装备": "校内运动装备，适合体育课、社团训练或日常锻炼使用，成色以页面标注为准。",
  "时尚穿搭": "校园日常穿搭闲置，尺码和成色建议面交时再次确认。",
  "乐器音响": "练习、社团和宿舍娱乐相关器材，支持校内安全地点当面试用。"
};

function buildDetail(item) {
  const numericId = Number((item.seller_id || "").replace(/\D/g, "")) || 1;
  const sellerName = sellerNames[(numericId - 1) % sellerNames.length];
  return {
    sellerName,
    sellerAvatar: sellerName.slice(0, 1),
    sellerMeta: `★★★★★ 4.${6 + (numericId % 4)} · 信誉分 ${92 + (numericId % 7)}`,
    description: `${item.title}，${categoryDescriptions[item.category] || "校园闲置 Demo 商品，适合同校同学线下面交。"} 原价 ¥${item.original_price}，当前标价 ¥${item.price}。`,
    meetupLabel: item.campus_location.replace(/\s*\d+米$/, "")
  };
}

Page({
  data: {
    item: null,
    detail: detailMap.item_001,
    favorited: false
  },
  onLoad(options) {
    const item = getItemById(options.item_id);
    this.setData({
      item,
      detail: detailMap[item.item_id] || buildDetail(item)
    });
  },
  shareItem() {
    wx.showToast({ title: "已生成分享卡片", icon: "success" });
  },
  toggleFavorite() {
    this.setData({ favorited: !this.data.favorited });
    wx.showToast({ title: this.data.favorited ? "已收藏" : "已取消收藏", icon: "success" });
  },
  chatSeller() {
    const chat = getChatByItemId(this.data.item.item_id);
    wx.navigateTo({ url: `/pages/message/chat?chat_id=${chat.id}` });
  },
  makeOffer() {
    const auth = requireVerified(app);
    if (!auth.ok) {
      wx.navigateTo({ url: auth.redirect });
      return;
    }
    wx.navigateTo({
      url: `/pages/goods/offer?item_id=${this.data.item.item_id}`
    });
  },
  openSeller() {
    wx.navigateTo({ url: `/pages/seller/store?seller_id=${this.data.item.seller_id}` });
  }
});
