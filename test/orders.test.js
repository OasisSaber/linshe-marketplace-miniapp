const test = require("node:test");
const assert = require("node:assert/strict");

const itemsData = require("../data/items");
const ordersData = require("../data/orders");
const { resetIds } = require("../services/id");
const orders = require("../services/orders");

test.beforeEach(() => {
  itemsData.resetItems();
  ordersData.resetOrders();
  resetIds();
});

test("create order stores transaction snapshot and reserves item", () => {
  const created = orders.createDemoOrder({
    item_id: "item_001",
    buyer_id: "buyer_test",
    meetup_location: "图书馆南门",
    deal_price: 20,
    guarantee_fee: 2,
    discount_amount: 1
  });

  assert.equal(created.ok, true);
  assert.equal(created.data.total_amount, 21);
  assert.equal(created.data.seller_id, "seller_001");
  assert.equal(itemsData.getItemById("item_001").status, "reserved");
});

test("pay only allows wait_pay to wait_meetup", () => {
  const created = orders.createDemoOrder({
    item_id: "item_001",
    deal_price: 20
  });
  const paid = orders.payDemoOrder(created.data.order_id);
  assert.equal(paid.ok, true);
  assert.equal(paid.data.trade_status, "wait_meetup");

  const repeated = orders.payDemoOrder(created.data.order_id);
  assert.equal(repeated.ok, false);
  assert.equal(repeated.error.code, "ORDER_INVALID_TRANSITION");
});

test("unpaid order cannot be completed", () => {
  const created = orders.createDemoOrder({
    item_id: "item_001",
    deal_price: 20
  });
  const completed = orders.completeDemoOrder(created.data.order_id);
  assert.equal(completed.ok, false);
  assert.equal(completed.error.code, "ORDER_INVALID_TRANSITION");
});

test("completion sells the item", () => {
  const created = orders.createDemoOrder({
    item_id: "item_001",
    deal_price: 20
  });
  orders.payDemoOrder(created.data.order_id);
  const completed = orders.completeDemoOrder(created.data.order_id);
  assert.equal(completed.ok, true);
  assert.equal(itemsData.getItemById("item_001").status, "sold");
  assert.ok(completed.data.completed_at);
});

test("cancel restores item availability", () => {
  const created = orders.createDemoOrder({
    item_id: "item_001",
    deal_price: 20
  });
  const cancelled = orders.cancelDemoOrder(created.data.order_id);
  assert.equal(cancelled.ok, true);
  assert.equal(itemsData.getItemById("item_001").status, "on_sale");
});

test("one item cannot have multiple active orders", () => {
  const first = orders.createDemoOrder({
    item_id: "item_001",
    deal_price: 20
  });
  assert.equal(first.ok, true);

  const second = orders.createDemoOrder({
    item_id: "item_001",
    deal_price: 21
  });
  assert.equal(second.ok, false);
});

test("invalid order never mutates order_001", () => {
  const before = ordersData.getOrderById("order_001").trade_status;
  const result = orders.completeDemoOrder("missing");
  assert.equal(result.ok, false);
  assert.equal(ordersData.getOrderById("order_001").trade_status, before);
});


test("money snapshot is rounded to two decimals", () => {
  const created = orders.createDemoOrder({
    item_id: "item_001",
    deal_price: 20.105,
    guarantee_fee: 0.2,
    discount_amount: 0.1
  });
  assert.equal(created.ok, true);
  assert.equal(created.data.deal_price, 20.11);
  assert.equal(created.data.total_amount, 20.21);
});
