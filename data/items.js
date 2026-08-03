const ITEM_SEEDS = [
  {
    item_id: "item_001",
    seller_id: "seller_001",
    title: "高等数学 第七版 上下册",
    description: "同济版高等数学教材，上下册齐全，重点章节有少量笔记，适合期末复习。",
    price: 25,
    original_price: 68,
    images: [{ src: "/images/goods/book.jpg", emoji: "📚" }],
    category: "教材课本",
    condition: "良好",
    campus_location: "图书馆南门 80米",
    supports_meetup: true,
    status: "on_sale",
    created_at: "2026-07-01T09:00:00.000Z"
  },
  {
    item_id: "item_002",
    seller_id: "seller_002",
    title: "MacBook Air M1 深空灰 256G",
    description: "日常学习办公使用，电池状态良好，机身有轻微使用痕迹，可当面验机。",
    price: 4500,
    original_price: 7999,
    images: [{ src: "/images/goods/macbook.jpg", emoji: "💻" }],
    category: "电子数码",
    condition: "9成新",
    campus_location: "理科楼 260米",
    supports_meetup: true,
    status: "reserved",
    created_at: "2026-07-02T09:00:00.000Z"
  },
  {
    item_id: "item_003",
    seller_id: "seller_003",
    title: "戴森 V8 无线吸尘器",
    description: "使用约半年，功能完好，配件齐全，支持图书馆附近当面验货。",
    price: 650,
    original_price: 2499,
    images: [{ src: "/images/goods/dyson.jpg", emoji: "🧹" }],
    category: "宿舍神器",
    condition: "9成新",
    campus_location: "北大图书馆南门",
    supports_meetup: true,
    status: "reserved",
    created_at: "2026-07-03T09:00:00.000Z"
  },
  {
    item_id: "item_004",
    seller_id: "seller_004",
    title: "宿舍小冰箱 42L 静音节能",
    description: "适合饮料和水果短期存放，毕业搬宿舍转让，支持现场通电检查。",
    price: 180,
    original_price: 399,
    images: [{ src: "/images/goods/fridge.jpg", emoji: "🧊" }],
    category: "宿舍神器",
    condition: "良好",
    campus_location: "燕园食堂 320米",
    supports_meetup: true,
    status: "on_sale",
    created_at: "2026-07-04T09:00:00.000Z"
  }
];

const EXTRA_ITEMS = [
  ["item_005", "seller_005", "概率论与数理统计辅导讲义", 18, 45, "/images/goods/notes.png", "📘", "教材课本", "良好", "三教门口 150米"],
  ["item_006", "seller_006", "英语六级真题合集 2025版", 20, 49, "/images/goods/cet.jpg", "📖", "教材课本", "全新", "二教大厅 210米"],
  ["item_007", "seller_007", "iPad Air 4 64G 绿色", 1800, 4799, "/images/goods/ipad.jpg", "📱", "电子数码", "9成新", "科学楼 180米"],
  ["item_008", "seller_008", "罗技 K380 蓝牙键盘", 95, 199, "/images/goods/keyboard.jpg", "⌨️", "电子数码", "良好", "理科楼咖啡角 120米"],
  ["item_009", "seller_009", "可折叠床上书桌 加宽款", 45, 89, "/images/goods/desk.jpg", "🪑", "宿舍神器", "良好", "勺园宿舍 360米"],
  ["item_010", "seller_010", "Spalding 室外篮球 7号", 60, 169, "/images/goods/basketball.jpg", "🏀", "运动装备", "良好", "五四体育场 90米"],
  ["item_011", "seller_011", "加厚防滑瑜伽垫 绿色", 35, 99, "/images/goods/yoga.jpg", "🧘", "运动装备", "良好", "邱德拔体育馆 240米"],
  ["item_012", "seller_012", "胜利入门羽毛球拍 单支", 88, 269, "/images/goods/badminton.jpg", "🏸", "运动装备", "9成新", "体育馆西门 180米"],
  ["item_013", "seller_013", "运动双肩包 黑色大容量", 70, 199, "/images/goods/backpack.jpg", "🎒", "运动装备", "9成新", "未名湖东侧 300米"],
  ["item_014", "seller_014", "优衣库牛仔外套 M码", 80, 299, "/images/goods/jacket.jpg", "🧥", "时尚穿搭", "良好", "学五食堂 160米"],
  ["item_015", "seller_015", "黑色马丁靴 38码", 120, 399, "/images/goods/boots.jpg", "👢", "时尚穿搭", "9成新", "东门地铁口 420米"],
  ["item_016", "seller_016", "毕业季正装衬衫 白色", 45, 159, "/images/goods/shirt.jpg", "👔", "时尚穿搭", "良好", "百讲门口 250米"],
  ["item_017", "seller_017", "Yamaha 民谣吉他 F310", 520, 980, "/images/goods/guitar.jpg", "🎸", "乐器音响", "良好", "艺术学院楼 200米"],
  ["item_018", "seller_018", "JBL GO3 蓝牙音箱", 160, 299, "/images/goods/speaker.jpg", "🔊", "乐器音响", "9成新", "静园草坪 280米"],
  ["item_019", "seller_019", "MIDI 小键盘 25键", 230, 499, "/images/goods/midi.jpg", "🎹", "乐器音响", "良好", "新太阳学生中心 170米"]
];

for (const [index, row] of EXTRA_ITEMS.entries()) {
  const [item_id, seller_id, title, price, original_price, src, emoji, category, condition, campus_location] = row;
  ITEM_SEEDS.push({
    item_id,
    seller_id,
    title,
    description: `${title}，校园闲置 Demo 商品，支持同校同学当面查看成色。`,
    price,
    original_price,
    images: [{ src, emoji }],
    category,
    condition,
    campus_location,
    supports_meetup: true,
    status: "on_sale",
    created_at: new Date(Date.UTC(2026, 6, index + 5, 9)).toISOString()
  });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

let items = clone(ITEM_SEEDS);

function getItems() {
  return items;
}

function getItemById(itemId) {
  if (!itemId) return null;
  return items.find((item) => item.item_id === itemId) || null;
}

function resetItems() {
  items = clone(ITEM_SEEDS);
  return items;
}

module.exports = {
  getItems,
  getItemById,
  resetItems
};
