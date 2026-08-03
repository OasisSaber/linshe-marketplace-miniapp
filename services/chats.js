const chats = [
  { id: "chat_001", item_id: "item_003", name: "李同学", avatar: "李", last: "可以，明天图书馆南门见", time: "14:32", unread: 1 },
  { id: "chat_002", item_id: "item_001", name: "张同学", avatar: "张", last: "高数教材还在吗？", time: "11:08", unread: 0 },
  { id: "chat_003", item_id: "item_002", name: "陈同学", avatar: "陈", last: "想当面看一下机器", time: "昨天", unread: 3 },
  { id: "chat_004", item_id: "item_004", name: "林同学", avatar: "林", last: "燕园食堂门口可以看", time: "周一", unread: 0 }
];

const MESSAGE_SEEDS = {
  chat_001: [
    { id: "m_001", side: "time", text: "今天 14:30" },
    { id: "m_002", side: "peer", text: "你好，请问这个吸尘器还在吗？" }
  ],
  chat_002: [{ id: "m_101", side: "peer", text: "高数教材还在吗？" }],
  chat_003: [{ id: "m_201", side: "peer", text: "想当面看一下机器。" }],
  chat_004: [{ id: "m_301", side: "peer", text: "燕园食堂门口可以看。" }]
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

let messages = clone(MESSAGE_SEEDS);
let messageCounter = 0;

function getChats() {
  return chats;
}

function getChatById(chatId) {
  if (!chatId) return null;
  return chats.find((chat) => chat.id === chatId) || null;
}

function getChatByItemId(itemId) {
  if (!itemId) return null;
  return chats.find((chat) => chat.item_id === itemId) || null;
}

function getMessages(chatId) {
  return Object.prototype.hasOwnProperty.call(messages, chatId)
    ? messages[chatId]
    : null;
}

function sendMessage(chatId, text) {
  const chatMessages = getMessages(chatId);
  if (!chatMessages) {
    return { ok: false, error: { code: "CHAT_NOT_FOUND", message: "会话不存在" } };
  }

  const normalized = String(text || "").trim();
  if (!normalized) {
    return { ok: false, error: { code: "MESSAGE_EMPTY", message: "消息不能为空" } };
  }

  messageCounter += 1;
  const message = {
    id: `m_local_${Date.now().toString(36)}_${messageCounter.toString(36)}`,
    side: "me",
    text: normalized
  };
  chatMessages.push(message);
  return { ok: true, data: chatMessages };
}

function resetChats() {
  messages = clone(MESSAGE_SEEDS);
  messageCounter = 0;
}

module.exports = {
  getChats,
  getChatById,
  getChatByItemId,
  getMessages,
  sendMessage,
  resetChats
};
