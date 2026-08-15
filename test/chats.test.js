const { test } = require("node:test");
const assert = require("node:assert/strict");

const chatsService = require("../services/chats");

test("getChats returns all seeded chats", () => {
  const chats = chatsService.getChats();
  assert.ok(chats.length >= 4);
  for (const chat of chats) {
    assert.ok(chat.id, "chat must have id");
    assert.ok(chat.item_id, "chat must reference an item");
    assert.ok(chat.name, "chat must have a peer name");
  }
});

test("getChatById finds a valid chat", () => {
  const chat = chatsService.getChatById("chat_002");
  assert.equal(chat.id, "chat_002");
  assert.equal(chat.item_id, "item_001");
});

test("getChatById falls back to first chat for unknown id", () => {
  // v0.1.0 behavior: unknown ids silently fall back to the first chat
  const first = chatsService.getChats()[0];
  const chat = chatsService.getChatById("chat_unknown");
  assert.equal(chat.id, first.id);
});

test("getChatByItemId finds chat by item", () => {
  const chat = chatsService.getChatByItemId("item_002");
  assert.equal(chat.id, "chat_003");
});

test("getMessages returns thread for known chat", () => {
  const messages = chatsService.getMessages("chat_001");
  assert.ok(messages.length >= 8);
  for (const message of messages) {
    assert.ok(message.id);
    assert.ok(message.side);
    assert.ok(message.text);
  }
});

test("getMessages falls back to first thread for unknown chat", () => {
  // v0.1.0 behavior: unknown ids silently fall back to chat_001 thread
  const fallback = chatsService.getMessages("chat_unknown");
  const first = chatsService.getMessages("chat_001");
  assert.equal(fallback, first);
});

test("sendMessage appends a message from me", () => {
  const thread = chatsService.getMessages("chat_001");
  const before = thread.length;
  const updated = chatsService.sendMessage("chat_001", "好的，明天见！");
  assert.equal(updated.length, before + 1);
  const last = updated[updated.length - 1];
  assert.ok(last.id.startsWith("m_"));
  assert.equal(last.side, "me");
  assert.equal(last.text, "好的，明天见！");
});
