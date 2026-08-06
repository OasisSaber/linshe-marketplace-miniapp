const test = require("node:test");
const assert = require("node:assert/strict");

const itemsData = require("../data/items");
const ordersData = require("../data/orders");
const { resetIds } = require("../services/id");
const { failure } = require("../services/result");
const {
  getCheckoutQuote,
  createAndPayDemoOrder
} = require("../services/checkout");
const { cancelDemoOrder } = require("../services/orders");

test.beforeEach(() => {
  itemsData.resetItems();
  ordersData.resetOrders();
  resetIds();
});

test("checkout quote uses canonical rounded amounts", () => {
  const result = getCheckoutQuote("item_001", "20.105", {
    guaranteeFee: 0.2,
    discountAmount: 0.1
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.dealPrice, 20.11);
  assert.equal(result.data.total, 20.21);
  assert.equal(result.data.meetupLocation, "图书馆南门 80米");
});

test("checkout rejects a tampered offer above list price", () => {
  const result = getCheckoutQuote("item_001", 999);
  assert.equal(result.ok, false);
  assert.equal(result.error.code, "OFFER_PRICE_INVALID");
});

test("checkout rejects unavailable items", () => {
  const result = getCheckoutQuote("item_003", 600);
  assert.equal(result.ok, false);
  assert.equal(result.error.code, "ITEM_NOT_AVAILABLE");
});

test("create and pay orchestration returns a paid order", () => {
  const result = createAndPayDemoOrder({
    item_id: "item_001",
    deal_price: 20
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.trade_status, "wait_meetup");
  assert.equal(itemsData.getItemById("item_001").status, "reserved");
});

test("payment failure compensates by cancelling the created order", () => {
  const result = createAndPayDemoOrder({
    item_id: "item_001",
    deal_price: 20
  }, {
    payDemoOrder() {
      return failure("PAYMENT_FAKE_FAILURE", "injected failure");
    },
    cancelDemoOrder
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "ORDER_PAYMENT_FAILED");
  assert.equal(result.error.details.recovered, true);
  assert.equal(itemsData.getItemById("item_001").status, "on_sale");

  const recoveredOrder = ordersData.getOrders().find((order) => {
    return order.order_id === result.error.details.orderId;
  });
  assert.equal(recoveredOrder.trade_status, "cancelled");
});


test("checkout orchestration cannot bypass the order price ceiling", () => {
  const beforeOrders = ordersData.getOrders().length;

  const result = createAndPayDemoOrder({
    item_id: "item_001",
    deal_price: 999
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "ORDER_PRICE_ABOVE_LIST");
  assert.equal(ordersData.getOrders().length, beforeOrders);
  assert.equal(itemsData.getItemById("item_001").status, "on_sale");
});
