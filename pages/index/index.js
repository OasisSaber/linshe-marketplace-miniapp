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

    // 防快速连点：按商品隔离的 300ms 窗口，同一商品快速双击只执行一次，
    // 不同商品之间互不干扰（收藏服务为同步调用，无需 busy 状态）。
    // Object.create(null) 避免 __proto__/constructor 键经原型链绕过窗口。
    this.favoriteTapAtById = this.favoriteTapAtById || Object.create(null);

    const now = Date.now();
    const lastTapAt = this.favoriteTapAtById[itemId] || 0;
    if (now - lastTapAt < 300) return;
    this.favoriteTapAtById[itemId] = now;

    const result = toggleFavorite(itemId);
    if (!result.ok) {
      wx.showToast({ title: result.error.message, icon: "none" });
      return;
    }
    this.refreshItems();
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
