const test = require("node:test");
const assert = require("node:assert/strict");

const data = require("../data/items");
const { resetIds } = require("../services/id");
const items = require("../services/items");

test.beforeEach(() => {
  data.resetItems();
  resetIds();
});

test("publishes canonical category and visible fields", () => {
  const result = items.createDemoItem({
    title: "宿舍台灯 暖光可调节",
    description: "使用一个学期，灯光正常，附带原装电源线。",
    price: "35",
    category: "家居",
    condition: "9成新",
    campus_location: "图书馆南门",
    supports_meetup: true
  }, "seller_001");

  assert.equal(result.ok, true);
  assert.equal(result.data.category, "宿舍神器");
  assert.match(result.data.description, /使用一个学期/);
  assert.equal(result.data.campus_location, "图书馆南门");
});

test("rejects empty and invalid prices", () => {
  for (const price of ["", 0, -1, "abc", Infinity]) {
    const result = items.createDemoItem({
      title: "宿舍台灯 暖光可调节",
      description: "使用一个学期，灯光正常，附带原装电源线。",
      price,
      category: "宿舍神器",
      condition: "良好",
      campus_location: "图书馆南门"
    });
    assert.equal(result.ok, false, `should reject ${String(price)}`);
  }
});

test("rejects short title and description", () => {
  const result = items.createDemoItem({
    title: "台灯",
    description: "好用",
    price: 35,
    category: "宿舍神器",
    condition: "良好",
    campus_location: "图书馆南门"
  });
  assert.equal(result.ok, false);
});


test("rejects unknown seller IDs", () => {
  const result = items.createDemoItem({
    title: "宿舍台灯 暖光可调节",
    description: "使用一个学期，灯光正常，附带原装电源线。",
    price: 35,
    category: "宿舍神器",
    condition: "良好",
    campus_location: "图书馆南门"
  }, "missing_seller");
  assert.equal(result.ok, false);
  assert.equal(result.error.code, "SELLER_NOT_FOUND");
});
