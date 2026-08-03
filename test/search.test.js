const test = require("node:test");
const assert = require("node:assert/strict");

const data = require("../data/items");
const { queryItems } = require("../services/search");

test.beforeEach(() => {
  data.resetItems();
});

test("search uses real item IDs", () => {
  const results = queryItems({ keyword: "MacBook" });
  assert.deepEqual(results.map((item) => item.item_id), ["item_002"]);
});

test("price sort changes order", () => {
  const results = queryItems({ category: "教材课本", sortBy: "price_asc" });
  const prices = results.map((item) => item.price);
  assert.deepEqual(prices, [...prices].sort((a, b) => a - b));
});

test("latest sort uses created_at", () => {
  const results = queryItems({ sortBy: "latest" });
  for (let index = 1; index < results.length; index += 1) {
    assert.ok(
      Date.parse(results[index - 1].created_at) >= Date.parse(results[index].created_at)
    );
  }
});

test("meetup filter only returns meetup items", () => {
  const item = data.getItemById("item_001");
  item.supports_meetup = false;
  const results = queryItems({ keyword: "高等数学", meetupOnly: true });
  assert.equal(results.length, 0);
});
