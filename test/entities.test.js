const test = require("node:test");
const assert = require("node:assert/strict");

const itemsData = require("../data/items");
const ordersData = require("../data/orders");
const chats = require("../services/chats");
const sellers = require("../services/sellers");

test.beforeEach(() => {
  itemsData.resetItems();
  ordersData.resetOrders();
  chats.resetChats();
});

test("invalid item ID returns null", () => {
  assert.equal(itemsData.getItemById("missing"), null);
});

test("invalid order ID returns null", () => {
  assert.equal(ordersData.getOrderById("missing"), null);
});

test("invalid chat ID does not fall back to chat_001", () => {
  assert.equal(chats.getChatById("missing"), null);
  assert.equal(chats.getMessages("missing"), null);
});

test("invalid chat cannot receive a message", () => {
  const before = chats.getMessages("chat_001").length;
  const result = chats.sendMessage("missing", "should not be written");
  assert.equal(result.ok, false);
  assert.equal(chats.getMessages("chat_001").length, before);
});

test("invalid seller returns explicit failure", () => {
  const result = sellers.getSellerView("missing");
  assert.equal(result.ok, false);
  assert.equal(result.error.code, "SELLER_NOT_FOUND");
});
