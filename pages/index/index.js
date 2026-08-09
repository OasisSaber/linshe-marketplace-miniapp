const { listItems, ITEM_STATUS_LABELS } = require("../../services/items");
const {
  isFavorite,
  toggleFavorite
} = require("../../services/favorites");

function buildVisibleItems(keyword, activeCategory) {
  const text = String(keyword || "").trim().toLowerCase();
  return listItems()
    .filter((item) => item.status !== "sold")
    .filter((item) => activeCategory === "全部" || item.category === activeCategory)
    .filter((item) => {
      return !text
        || item.title.toLowerCase().includes(text)
        || item.campus_location.toLowerCase().includes(text);
    })
    .map((item) => ({
      ...item,
      isFavorite: isFavorite(item.item_id),
      statusLabel: ITEM_STATUS_LABELS[item.status] || item.status
    }));
}

Page({
  data: {
    keyword: "",
    campus: "北京大学",
    categories: [
      { name: "全部", label: "全部" },
      { name: "教材课本", label: "教材" },
      { name: "电子数码", label: "数码" },
      { name: "宿舍神器", label: "宿舍" },
      { name: "运动装备", label: "运动" },
      { name: "时尚穿搭", label: "穿搭" },
      { name: "乐器音响", label: "乐器" }
    ],
    activeCategory: "全部",
    feedCount: 0,
    loading: false,
    favoriteBusy: false,
    items: []
  },

  onLoad() {
    this.setData({ loading: true });
    this.refreshItems({ loading: false });
  },

  onShow() {
    this.refreshItems();
  },

  refreshItems(patch) {
    const next = Object.assign({}, this.data, patch || {});
    const items = buildVisibleItems(next.keyword, next.activeCategory);
    this.setData(Object.assign({}, patch || {}, {
      items,
      feedCount: items.length
    }));
  },

  onSearchInput(event) {
    this.refreshItems({ keyword: event.detail.value });
  },

  selectCategory(event) {
    this.refreshItems({ activeCategory: event.currentTarget.dataset.name });
  },

  openFilter() {
    wx.navigateTo({
      url: `/pages/search/filter?keyword=${encodeURIComponent(this.data.keyword)}`
    });
  },

  toggleFavorite(event) {
    const itemId = event.currentTarget.dataset.id;
    if (!itemId) return;

    // 防快速连点：300ms 窗口内忽略重复点击（同步服务下锁需保持到窗口结束）
    const now = Date.now();
    if (now - (this.lastFavoriteTapAt || 0) < 300) return;
    this.lastFavoriteTapAt = now;

    this.setData({ favoriteBusy: true });
    const result = toggleFavorite(itemId);
    if (!result.ok) {
      this.setData({ favoriteBusy: false });
      wx.showToast({ title: result.error.message, icon: "none" });
      return;
    }
    this.refreshItems();
    this.setData({ favoriteBusy: false });
    wx.showToast({
      title: result.data.favorite ? "已收藏" : "已取消收藏",
      icon: "none"
    });
  },

  openDetail(event) {
    wx.navigateTo({
      url: `/pages/goods/detail?item_id=${event.currentTarget.dataset.id}`
    });
  },

  resetSearch() {
    this.refreshItems({ keyword: "", activeCategory: "全部" });
  }
});
