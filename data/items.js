const items = [
  {
    item_id: "item_001",
    seller_id: "seller_001",
    title: "高等数学 第七版 上下册",
    price: 25.0,
    original_price: 68.0,
    images: ["📚"],
    category: "教材课本",
    condition: "良好",
    campus_location: "图书馆南门 80米",
    status: "on_sale"
  },
  {
    item_id: "item_002",
    seller_id: "seller_002",
    title: "MacBook Air M1 深空灰 256G",
    price: 4500.0,
    original_price: 7999.0,
    images: ["💻"],
    category: "电子数码",
    condition: "9成新",
    campus_location: "理科楼 260米",
    status: "reserved"
  },
  {
    item_id: "item_003",
    seller_id: "seller_003",
    title: "戴森 V8 无线吸尘器 手持式家用除螨仪",
    price: 650.0,
    original_price: 2499.0,
    images: ["🧹"],
    category: "宿舍神器",
    condition: "9成新",
    campus_location: "北大图书馆南门",
    status: "on_sale"
  },
  {
    item_id: "item_004",
    seller_id: "seller_004",
    title: "宿舍小冰箱 42L 静音节能",
    price: 180.0,
    original_price: 399.0,
    images: ["🧊"],
    category: "宿舍神器",
    condition: "良好",
    campus_location: "燕园食堂 320米",
    status: "on_sale"
  }
];

items.push(
  {
    item_id: "item_005",
    seller_id: "seller_005",
    title: "概率论与数理统计辅导讲义",
    price: 18.0,
    original_price: 45.0,
    images: ["📘"],
    category: "教材课本",
    condition: "良好",
    campus_location: "三教门口 150米",
    status: "on_sale"
  },
  {
    item_id: "item_006",
    seller_id: "seller_006",
    title: "英语六级真题合集 2025版",
    price: 20.0,
    original_price: 49.0,
    images: ["📖"],
    category: "教材课本",
    condition: "全新",
    campus_location: "二教大厅 210米",
    status: "on_sale"
  },
  {
    item_id: "item_007",
    seller_id: "seller_007",
    title: "iPad Air 4 64G 绿色",
    price: 1800.0,
    original_price: 4799.0,
    images: ["📱"],
    category: "电子数码",
    condition: "9成新",
    campus_location: "科学楼 180米",
    status: "on_sale"
  },
  {
    item_id: "item_008",
    seller_id: "seller_008",
    title: "罗技 K380 蓝牙键盘",
    price: 95.0,
    original_price: 199.0,
    images: ["⌨️"],
    category: "电子数码",
    condition: "良好",
    campus_location: "理科楼咖啡角 120米",
    status: "on_sale"
  },
  {
    item_id: "item_009",
    seller_id: "seller_009",
    title: "可折叠床上书桌 加宽款",
    price: 45.0,
    original_price: 89.0,
    images: ["🪑"],
    category: "宿舍神器",
    condition: "良好",
    campus_location: "勺园宿舍 360米",
    status: "on_sale"
  },
  {
    item_id: "item_010",
    seller_id: "seller_010",
    title: "Spalding 室外篮球 7号",
    price: 60.0,
    original_price: 169.0,
    images: ["🏀"],
    category: "运动装备",
    condition: "良好",
    campus_location: "五四体育场 90米",
    status: "on_sale"
  },
  {
    item_id: "item_011",
    seller_id: "seller_011",
    title: "加厚防滑瑜伽垫 绿色",
    price: 35.0,
    original_price: 99.0,
    images: ["🧘"],
    category: "运动装备",
    condition: "良好",
    campus_location: "邱德拔体育馆 240米",
    status: "on_sale"
  },
  {
    item_id: "item_012",
    seller_id: "seller_012",
    title: "胜利入门羽毛球拍 单支",
    price: 88.0,
    original_price: 269.0,
    images: ["🏸"],
    category: "运动装备",
    condition: "9成新",
    campus_location: "体育馆西门 180米",
    status: "on_sale"
  },
  {
    item_id: "item_013",
    seller_id: "seller_013",
    title: "运动双肩包 黑色大容量",
    price: 70.0,
    original_price: 199.0,
    images: ["🎒"],
    category: "运动装备",
    condition: "9成新",
    campus_location: "未名湖东侧 300米",
    status: "on_sale"
  },
  {
    item_id: "item_014",
    seller_id: "seller_014",
    title: "优衣库牛仔外套 M码",
    price: 80.0,
    original_price: 299.0,
    images: ["🧥"],
    category: "时尚穿搭",
    condition: "良好",
    campus_location: "学五食堂 160米",
    status: "on_sale"
  },
  {
    item_id: "item_015",
    seller_id: "seller_015",
    title: "黑色马丁靴 38码",
    price: 120.0,
    original_price: 399.0,
    images: ["👢"],
    category: "时尚穿搭",
    condition: "9成新",
    campus_location: "东门地铁口 420米",
    status: "on_sale"
  },
  {
    item_id: "item_016",
    seller_id: "seller_016",
    title: "毕业季正装衬衫 白色",
    price: 45.0,
    original_price: 159.0,
    images: ["👔"],
    category: "时尚穿搭",
    condition: "良好",
    campus_location: "百讲门口 250米",
    status: "on_sale"
  },
  {
    item_id: "item_017",
    seller_id: "seller_017",
    title: "Yamaha 民谣吉他 F310",
    price: 520.0,
    original_price: 980.0,
    images: ["🎸"],
    category: "乐器音响",
    condition: "良好",
    campus_location: "艺术学院楼 200米",
    status: "on_sale"
  },
  {
    item_id: "item_018",
    seller_id: "seller_018",
    title: "JBL GO3 蓝牙音箱",
    price: 160.0,
    original_price: 299.0,
    images: ["🔊"],
    category: "乐器音响",
    condition: "9成新",
    campus_location: "静园草坪 280米",
    status: "on_sale"
  },
  {
    item_id: "item_019",
    seller_id: "seller_019",
    title: "MIDI 小键盘 25键",
    price: 230.0,
    original_price: 499.0,
    images: ["🎹"],
    category: "乐器音响",
    condition: "良好",
    campus_location: "新太阳学生中心 170米",
    status: "on_sale"
  }
);

function getItems() {
  return items;
}

function getItemById(itemId) {
  return items.find((item) => item.item_id === itemId) || items[0];
}

module.exports = {
  getItems,
  getItemById
};
