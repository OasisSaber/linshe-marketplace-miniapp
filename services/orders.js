const { getOrders, getOrderById } = require("../data/orders");
const { getItemById } = require("./items");

function getDemoQr(orderId) {
  return `demo-verify-code:${orderId}`;
}

function createDemoOrder(payload) {
  const item = getItemById(payload.item_id || "item_003");
  const order = {
    order_id: `order_demo_${Date.now()}`,
    item_id: item.item_id,
    buyer_id: payload.buyer_id || "buyer_001",
    meetup_location: payload.meetup_location || item.campus_location,
    trade_status: "wait_pay",
    verify_qr_code: getDemoQr(item.item_id)
  };

  getOrders().unshift(order);
  return order;
}

function payDemoOrder(orderId) {
  const order = getOrderById(orderId);
  order.trade_status = "wait_meetup";
  order.verify_qr_code = getDemoQr(order.order_id);
  return order;
}

function completeDemoOrder(orderId) {
  const order = getOrderById(orderId);
  order.trade_status = "completed";
  return order;
}

function getOrderView(orderId) {
  const order = getOrderById(orderId);
  return {
    order,
    item: getItemById(order.item_id),
    verified: order.trade_status === "completed",
    timeline: buildTimeline(order.trade_status)
  };
}

function buildTimeline(status) {
  const paid = status === "wait_meetup" || status === "completed";
  const completed = status === "completed";
  return [
    { title: "订单已创建", time: "Demo 自动生成", state: "done" },
    { title: "模拟支付已通过", time: paid ? "资金进入演示托管" : "等待确认支付", state: paid ? "done" : "current" },
    { title: "等待校内面交", time: completed ? "双方已完成验货" : "约定图书馆南门", state: completed ? "done" : paid ? "current" : "" },
    { title: "交易完成", time: completed ? "模拟核销自动通过" : "等待核销", state: completed ? "done" : "" }
  ];
}

module.exports = {
  createDemoOrder,
  payDemoOrder,
  completeDemoOrder,
  getOrderView
};
