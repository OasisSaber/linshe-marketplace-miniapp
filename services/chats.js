const chats = [
  { id: "chat_001", item_id: "item_003", name: "李同学", avatar: "李", color: "purple", last: "可以！明天图书馆南门见 👍", time: "14:32", unread: 1, goods: "🧹", goodsBg: "dark" },
  { id: "chat_002", item_id: "item_001", name: "张同学", avatar: "张", color: "orange", last: "高数教材还在吗？明天上午可以取", time: "11:08", unread: 0, goods: "📚", goodsBg: "blue" },
  { id: "chat_003", item_id: "item_002", name: "陈同学", avatar: "陈", color: "red", last: "MacBook 这个还有吗？想要", time: "昨天", unread: 3, goods: "💻", goodsBg: "navy" },
  { id: "chat_004", item_id: "item_004", name: "林同学", avatar: "林", color: "green", last: "小冰箱还在，燕园食堂门口可以看", time: "周一", unread: 0, goods: "🧊", goodsBg: "blue" }
];

const messages = {
  chat_001: [
    { id: "m_001", side: "time", text: "今天 14:30" },
    { id: "m_002", side: "peer", text: "你好！请问这个吸尘器现在还在吗？" },
    { id: "m_003", side: "me", text: "在的，品相很好，基本没怎么用" },
    { id: "m_004", side: "peer", text: "请问可以便宜一点吗？能不能 600？" },
    { id: "m_005", side: "me", text: "最低 630 了，你看可以吗" },
    { id: "m_006", side: "peer", text: "好吧，630 就 630，那我们什么时候可以见面？" },
    { id: "m_007", side: "me", text: "明天下午3点，图书馆南门，方便吗？" },
    { id: "m_008", side: "peer", text: "可以！明天见 👍" }
  ],
  chat_002: [
    { id: "m_101", side: "time", text: "今天 11:02" },
    { id: "m_102", side: "peer", text: "同学，高数教材还在吗？" },
    { id: "m_103", side: "me", text: "还在，上下册都在，笔记主要集中在重点章节" },
    { id: "m_104", side: "peer", text: "好的，我明天上午有空，可以取" }
  ],
  chat_003: [
    { id: "m_201", side: "time", text: "昨天 20:18" },
    { id: "m_202", side: "peer", text: "MacBook 这个还有吗？想要" },
    { id: "m_203", side: "me", text: "还在，电池状态良好，充电器也可以一起给你" },
    { id: "m_204", side: "peer", text: "可以在理科楼看一下机器吗？" }
  ],
  chat_004: [
    { id: "m_301", side: "time", text: "周一 18:20" },
    { id: "m_302", side: "peer", text: "小冰箱还在，燕园食堂门口可以看" },
    { id: "m_303", side: "me", text: "好的，我想确认一下制冷和噪音情况" }
  ]
};

function getChats() {
  return chats;
}

function getChatById(chatId) {
  return chats.find((chat) => chat.id === chatId) || chats[0];
}

function getChatByItemId(itemId) {
  return chats.find((chat) => chat.item_id === itemId) || chats[0];
}

function getMessages(chatId) {
  return messages[chatId] || messages.chat_001;
}

function sendMessage(chatId, text) {
  const chatMessages = getMessages(chatId);
  const message = {
    id: `m_${Date.now()}`,
    side: "me",
    text
  };
  chatMessages.push(message);
  return chatMessages;
}

module.exports = {
  getChats,
  getChatById,
  getChatByItemId,
  getMessages,
  sendMessage
};
