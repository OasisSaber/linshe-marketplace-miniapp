const { listItems } = require("../../services/items");

function buildVisibleItems(keyword, activeCategory, favoriteMap) {
  const text = (keyword || "").trim();
  return listItems()
    .filter((item) => activeCategory === "全部" || item.category === activeCategory)
    .filter((item) => !text || item.title.includes(text) || item.campus_location.includes(text))
    .map((item) => ({
      ...item,
      isFavorite: Boolean(favoriteMap[item.item_id])
    }));
}

Page({
  data: {
    keyword: "",
    campus: "北京大学",
    categories: [
      { name: "全部", icon: "⌕" },
      { name: "教材课本", icon: "📚" },
      { name: "电子数码", icon: "💻" },
      { name: "宿舍神器", icon: "🏠" },
      { name: "运动装备", icon: "⚽" },
      { name: "时尚穿搭", icon: "👗" },
      { name: "乐器音响", icon: "🎵" }
    ],
    activeCategory: "全部",
    favoriteMap: {},
    feedCount: 0,
    items: []
  },
  onLoad() {
    this.refreshItems();
  },
  refreshItems(patch) {
    const nextData = Object.assign({}, this.data, patch || {});
    const items = buildVisibleItems(nextData.keyword, nextData.activeCategory, nextData.favoriteMap);
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
    wx.navigateTo({ url: "/pages/search/filter" });
  },
  openPromotion() {
    const item = listItems().find((entry) => entry.status === "on_sale") || listItems()[0];
    wx.navigateTo({ url: `/pages/goods/detail?item_id=${item.item_id}` });
  },
  toggleFavorite(event) {
    const itemId = event.currentTarget.dataset.id;
    const favoriteMap = Object.assign({}, this.data.favoriteMap);
    favoriteMap[itemId] = !favoriteMap[itemId];
    this.refreshItems({ favoriteMap });
    wx.showToast({
      title: favoriteMap[itemId] ? "已收藏" : "已取消收藏",
      icon: "success"
    });
  },
  openDetail(event) {
    wx.navigateTo({
      url: `/pages/goods/detail?item_id=${event.currentTarget.dataset.id}`
    });
  }
});
