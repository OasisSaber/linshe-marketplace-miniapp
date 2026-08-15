const { test } = require("node:test");
const assert = require("node:assert/strict");

const { getItems } = require("../data/items");
const { getOrders } = require("../data/orders");
const chatsService = require("../services/chats");

const ALLOWED_STATUSES = ["on_sale", "reserved", "sold"];
const ALLOWED_CONDITIONS = ["全新", "9成新", "良好"];

test("item ids are unique and complete", () => {
  const items = getItems();
  const ids = items.map((item) => item.item_id);
  assert.equal(new Set(ids).size, ids.length, "item ids must be unique");
  for (const item of items) {
    assert.ok(item.item_id.startsWith("item_"), "item_id must use item_ prefix");
  }
});

test("item fields are consistent", () => {
  for (const item of getItems()) {
    assert.ok(item.title.trim(), "title must not be blank");
    assert.ok(item.price > 0, "price must be positive");
    assert.ok(item.original_price >= item.price, "original_price must not be below price");
    assert.ok(ALLOWED_STATUSES.includes(item.status), "unexpected status: " + item.status);
    assert.ok(ALLOWED_CONDITIONS.includes(item.condition), "unexpected condition: " + item.condition);
    assert.ok(Array.isArray(item.images) && item.images.length > 0, "images must be non-empty");
    assert.ok(item.campus_location.trim(), "campus_location must not be blank");
    assert.ok(item.category, "category must be set");
  }
});

test("order references resolve to real items", () => {
  const items = getItems();
  for (const order of getOrders()) {
    assert.ok(order.order_id, "order must have order_id");
    const referenced = items.find((item) => item.item_id === order.item_id);
    assert.ok(referenced, "order references missing item: " + order.item_id);
    assert.ok(order.buyer_id, "order must have buyer_id");
    assert.ok(["wait_pay", "wait_meetup", "completed"].includes(order.trade_status), "unexpected trade_status");
  }
});

test("order ids are unique", () => {
  const ids = getOrders().map((order) => order.order_id);
  assert.equal(new Set(ids).size, ids.length, "order ids must be unique");
});

test("chat item references resolve to real items", () => {
  const itemIds = new Set(getItems().map((item) => item.item_id));
  for (const chat of chatsService.getChats()) {
    assert.ok(itemIds.has(chat.item_id), "chat references missing item: " + chat.item_id);
  }
});

test("message threads have stable unique ids", () => {
  for (const chat of chatsService.getChats()) {
    const messages = chatsService.getMessages(chat.id);
    const ids = messages.map((message) => message.id);
    assert.equal(new Set(ids).size, ids.length, "message ids must be unique in " + chat.id);
    for (const message of messages) {
      assert.ok(message.text, "message must have text");
      assert.ok(["time", "peer", "me"].includes(message.side), "unexpected message side");
    }
  }
});
