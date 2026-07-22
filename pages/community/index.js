Page({
  data: {
    activeTab: "校区",
    posts: [
      {
        id: "post_001",
        user: "张同学",
        avatar: "张",
        color: "orange",
        time: "10分钟前",
        content: "宿舍大扫除出了一堆宝贝！🧹 全都是九成新，价格美丽，感兴趣的同学快来捡漏，数量有限，先到先得哦～",
        images: [
          { emoji: "📚", bg: "dark" },
          { emoji: "💻", bg: "yellow" },
          { emoji: "🎧", bg: "pink" },
          { emoji: "📷", bg: "blue" }
        ],
        likes: 32,
        comments: 8,
        shares: 3,
        liked: false,
        followed: false
      },
      {
        id: "post_002",
        user: "李同学",
        avatar: "李",
        color: "purple",
        time: "1小时前",
        content: "在邻舍淘到了超划算的高数教材 📖，上学期的题都有标注，简直是备考神器！强烈推荐学弟学妹来看看，性价比超高！",
        images: [],
        likes: 15,
        comments: 3,
        shares: 1,
        liked: true,
        followed: true
      },
      {
        id: "post_003",
        user: "王同学",
        avatar: "王",
        color: "green",
        time: "3小时前",
        content: "宿舍改造完工了！✨ 感谢在邻舍淘到的各种好物，总花费不到200块，效果超惊艳！大家快来给我点赞鼓励一下 🙏",
        images: [
          { emoji: "🛋️", bg: "dark" },
          { emoji: "🪴", bg: "yellow" },
          { emoji: "💡", bg: "pink" },
          { emoji: "🎨", bg: "blue" }
        ],
        likes: 67,
        comments: 12,
        shares: 5,
        liked: false,
        followed: false
      }
    ]
  },
  setTab(event) {
    this.setData({ activeTab: event.currentTarget.dataset.tab });
  },
  createPost() {
    const post = {
      id: `post_demo_${Date.now()}`,
      user: "我",
      avatar: "我",
      color: "green",
      time: "刚刚",
      content: "Demo 发帖成功：约同学一起交换闲置教材，优先图书馆南门面交。",
      images: [],
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      followed: false
    };
    this.setData({ posts: [post].concat(this.data.posts) });
    wx.showToast({ title: "Demo 发帖成功", icon: "success" });
  },
  updatePost(postId, updater) {
    this.setData({
      posts: this.data.posts.map((post) => post.id === postId ? updater(Object.assign({}, post)) : post)
    });
  },
  toggleFollow(event) {
    const postId = event.currentTarget.dataset.id;
    let followed = false;
    this.updatePost(postId, (post) => {
      post.followed = !post.followed;
      followed = post.followed;
      return post;
    });
    wx.showToast({ title: followed ? "已关注同学" : "已取消关注", icon: "success" });
  },
  openPostMore() {
    wx.showToast({ title: "已打开帖子操作 Demo", icon: "none" });
  },
  toggleLike(event) {
    const postId = event.currentTarget.dataset.id;
    this.updatePost(postId, (post) => {
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
      return post;
    });
  },
  commentPost() {
    wx.showToast({ title: "Demo 评论入口已打开", icon: "none" });
  },
  sharePost(event) {
    const postId = event.currentTarget.dataset.id;
    this.updatePost(postId, (post) => {
      post.shares += 1;
      return post;
    });
    wx.showToast({ title: "已生成分享卡片", icon: "success" });
  }
});
