const test = require("node:test");
const assert = require("node:assert/strict");

const itemsData = require("../data/items");
const ordersData = require("../data/orders");
const { getSellers } = require("../data/sellers");

test.beforeEach(() => {
  itemsData.resetItems();
  ordersData.resetOrders();
});

test("seed IDs are unique and references are valid", () => {
  const items = itemsData.getItems();
  const orders = ordersData.getOrders();
  const sellers = getSellers();

  assert.equal(new Set(items.map((item) => item.item_id)).size, items.length);
  assert.equal(new Set(orders.map((order) => order.order_id)).size, orders.length);

  const sellerIds = new Set(sellers.map((seller) => seller.seller_id));
  for (const item of items) {
    assert.equal(sellerIds.has(item.seller_id), true, item.seller_id);
  }

  for (const order of orders) {
    const item = itemsData.getItemById(order.item_id);
    assert.ok(item, order.item_id);
    assert.equal(item.seller_id, order.seller_id);
    if (["wait_pay", "wait_meetup"].includes(order.trade_status)) {
      assert.equal(item.status, "reserved");
    }
  }
});
