const { test } = require("node:test");
const assert = require("node:assert/strict");

const ordersService = require("../services/orders");
const { getOrders } = require("../data/orders");
const { getItems } = require("../data/items");

function findOrder(orderId) {
  return getOrders().find((order) => order.order_id === orderId);
}

test("createDemoOrder creates a wait_pay order for default item", () => {
  const before = getOrders().length;
  const order = ordersService.createDemoOrder({});
  assert.ok(order.order_id.startsWith("order_demo_"));
  assert.equal(order.item_id, "item_003");
  assert.equal(order.buyer_id, "buyer_001");
  assert.equal(order.trade_status, "wait_pay");
  assert.ok(order.verify_qr_code.startsWith("demo-verify-code:item_003"));
  assert.equal(getOrders().length, before + 1);
  assert.equal(getOrders()[0].order_id, order.order_id);
});

test("createDemoOrder honors buyer and location payload", () => {
  const order = ordersService.createDemoOrder({
    item_id: "item_001",
    buyer_id: "buyer_077",
    meetup_location: "未名湖石舫"
  });
  assert.equal(order.item_id, "item_001");
  assert.equal(order.buyer_id, "buyer_077");
  assert.equal(order.meetup_location, "未名湖石舫");
});

test("payDemoOrder moves wait_pay to wait_meetup and rebinds qr", () => {
  const order = ordersService.createDemoOrder({});
  const paid = ordersService.payDemoOrder(order.order_id);
  assert.equal(paid.trade_status, "wait_meetup");
  assert.equal(paid.verify_qr_code, "demo-verify-code:" + order.order_id);
  assert.equal(findOrder(order.order_id).trade_status, "wait_meetup");
});

test("completeDemoOrder moves to completed", () => {
  const order = ordersService.createDemoOrder({});
  ordersService.payDemoOrder(order.order_id);
  const done = ordersService.completeDemoOrder(order.order_id);
  assert.equal(done.trade_status, "completed");
  assert.equal(findOrder(order.order_id).trade_status, "completed");
});

test("getOrderView resolves item and verified flag", () => {
  const order = ordersService.createDemoOrder({ item_id: "item_007" });
  const view = ordersService.getOrderView(order.order_id);
  assert.equal(view.order.order_id, order.order_id);
  assert.equal(view.item.item_id, "item_007");
  assert.equal(view.verified, false);
  assert.equal(view.timeline.length, 4);
});

test("getOrderView marks completed order verified", () => {
  const order = ordersService.createDemoOrder({});
  ordersService.payDemoOrder(order.order_id);
  ordersService.completeDemoOrder(order.order_id);
  const view = ordersService.getOrderView(order.order_id);
  assert.equal(view.verified, true);
  assert.ok(view.timeline.every((step) => step.state === "done"));
});

test("timeline reflects wait_pay state", () => {
  const order = ordersService.createDemoOrder({});
  const view = ordersService.getOrderView(order.order_id);
  const states = view.timeline.map((step) => step.state);
  assert.deepEqual(states, ["done", "current", "", ""]);
});

test("timeline reflects wait_meetup state", () => {
  const order = ordersService.createDemoOrder({});
  ordersService.payDemoOrder(order.order_id);
  const view = ordersService.getOrderView(order.order_id);
  const states = view.timeline.map((step) => step.state);
  assert.deepEqual(states, ["done", "done", "current", ""]);
});
