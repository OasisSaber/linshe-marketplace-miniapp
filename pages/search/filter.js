const { queryItems } = require("../../services/search");
const { CANONICAL_CATEGORIES } = require("../../services/items");
const { THEME } = require("../../config/theme");

function safeDecode(value) {
  try {
    return decodeURIComponent(String(value || ""));
  } catch (error) {
    return String(value || "");
  }
}

Page({
  data: {
    keyword: "",
    brandColor: THEME.brandColor,
    category: "全部",
    sortBy: "relevance",
    meetupOnly: false,
    categories: ["全部", ...CANONICAL_CATEGORIES],
    sorts: [
      { label: "综合", value: "relevance" },
      { label: "价格最低", value: "price_asc" },
      { label: "最新发布", value: "latest" }
    ],
    results: []
  },

  onLoad(options) {
    this.setData({ keyword: safeDecode(options.keyword) });
    this.refresh();
  },

  updateKeyword(event) {
    this.setData({ keyword: event.detail.value });
    this.refresh();
  },

  selectCategory(event) {
    this.setData({ category: event.currentTarget.dataset.value });
    this.refresh();
  },

  selectSort(event) {
    this.setData({ sortBy: event.currentTarget.dataset.value });
    this.refresh();
  },

  toggleMeetup(event) {
    this.setData({ meetupOnly: event.detail.value });
    this.refresh();
  },

  clearFilters() {
    this.setData({
      keyword: "",
      category: "全部",
      sortBy: "relevance",
      meetupOnly: false
    });
    this.refresh();
  },

  refresh() {
    const results = queryItems({
      keyword: this.data.keyword,
      category: this.data.category,
      sortBy: this.data.sortBy,
      meetupOnly: this.data.meetupOnly
    });
    this.setData({ results });
  },

  openDetail(event) {
    const itemId = event.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/goods/detail?item_id=${itemId}` });
  }
});
