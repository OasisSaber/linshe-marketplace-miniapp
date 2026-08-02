Page({
  data: {
    query: "高数教材",
    activeSort: "综合排序",
    filters: ["综合排序", "价格最低", "最新发布", "仅看面交", "仅看图书"],
    results: [
      { id: "r_001", item_id: "item_001", emoji: "📚", src: "/images/goods/book.jpg", bg: "yellow", price: 22, title: "高等数学 第八版 同济大学", condition: "9成新", seller: "赵", distance: "120米" },
      { id: "r_002", item_id: "item_001", emoji: "📖", src: "/images/goods/notes.png", bg: "red", price: 35, title: "高数辅导书 全套 张宇考研", condition: "良好", seller: "钱", distance: "280米" },
      { id: "r_003", item_id: "item_001", emoji: "📒", src: "/images/goods/cet.jpg", bg: "purple", price: 15, title: "高数习题集 带答案 详解版", condition: "良好", seller: "孙", distance: "90米" },
      { id: "r_004", item_id: "item_001", emoji: "📗", src: "/images/goods/book.jpg", bg: "green", price: 28, title: "同济高数 第七版 无笔记", condition: "9成新", seller: "李", distance: "350米" },
      { id: "r_005", item_id: "item_001", emoji: "📘", src: "/images/goods/notes.png", bg: "blue", price: 20, title: "线性代数 第六版 浙大版", condition: "全新", seller: "周", distance: "180米" },
      { id: "r_006", item_id: "item_001", emoji: "📕", src: "/images/goods/cet.jpg", bg: "pink", price: 18, title: "概率论与数理统计 盛骤版", condition: "良好", seller: "吴", distance: "220米" }
    ]
  },
  goBack() {
    wx.navigateBack();
  },
  selectSort(event) {
    this.setData({ activeSort: event.currentTarget.dataset.value });
  },
  openDetail(event) {
    const itemId = event.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/goods/detail?item_id=${itemId}` });
  }
});
