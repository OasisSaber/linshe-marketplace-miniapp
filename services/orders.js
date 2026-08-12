const { getOrders, getOrderById } = require("../data/orders");
const { getItemById, updateItemStatus } = require("./items");
const { createId } = require("./id");
const { success, failure } = require("./result");

const ACTIVE_STATUSES = ["wait_pay", "wait_meetup"];
const STATUS_LABELS = {
  wait_pay: "等待 Demo 支付",
  wait_meetup: "等待校内面交",
  completed: "交易已完成",
  cancelled: "订单已取消"
};
const TRANSITIONS = {
  wait_pay: ["wait_meetup", "cancelled"],
  wait_meetup: ["completed", "cancelled"],
  completed: [],
  cancelled: []
};

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function getDemoQr(orderId) {
  return `demo-verify-code:${orderId}`;
}

function hasActiveOrder(itemId) {
  return getOrders().some((order) => {
    return order.item_id === itemId && ACTIVE_STATUSES.includes(order.trade_status);
  });
}

function createDemoOrder(payload) {
  const item = getItemById(payload && payload.item_id);
  if (!item) {
    return failure("ITEM_NOT_FOUND", "商品不存在");
  }
  if (item.status !== "on_sale") {
    return failure("ITEM_NOT_AVAILABLE", "商品当前不可下单", { status: item.status });
  }
  if (hasActiveOrder(item.item_id)) {
    return failure("ORDER_ACTIVE_EXISTS", "该商品已有进行中的订单");
  }

  const rawDealPrice = Number(payload.deal_price == null ? item.price : payload.deal_price);
  const rawGuaranteeFee = Number(payload.guarantee_fee == null ? 2 : payload.guarantee_fee);
  const rawDiscountAmount = Number(payload.discount_amount == null ? 2 : payload.discount_amount);

  if (!Number.isFinite(rawDealPrice) || rawDealPrice <= 0) {
    return failure("ORDER_PRICE_INVALID", "成交价必须是有效正数");
  }

  const dealPrice = roundMoney(rawDealPrice);
  if (dealPrice <= 0) {
    return failure("ORDER_PRICE_INVALID", "成交价至少为 0.01");
  }
  if (rawDealPrice > item.price) {
    return failure(
      "ORDER_PRICE_ABOVE_LIST",
      "成交价不能高于商品标价",
      {
        itemId: item.item_id,
        dealPrice: rawDealPrice,
        listPrice: item.price
      }
    );
  }
  if (!Number.isFinite(rawGuaranteeFee) || rawGuaranteeFee < 0 ||
      !Number.isFinite(rawDiscountAmount) || rawDiscountAmount < 0) {
    return failure("ORDER_FEE_INVALID", "订单费用必须是有效非负数");
  }

  const guaranteeFee = roundMoney(rawGuaranteeFee);
  const discountAmount = roundMoney(rawDiscountAmount);
  const totalAmount = roundMoney(dealPrice + guaranteeFee - discountAmount);
  if (!Number.isFinite(totalAmount) || totalAmount < 0) {
    return failure("ORDER_TOTAL_INVALID", "订单总额无效");
  }

  const orderId = createId("order");
  const order = {
    order_id: orderId,
    item_id: item.item_id,
    seller_id: item.seller_id,
    buyer_id: payload.buyer_id || "buyer_001",
    meetup_location: payload.meetup_location || item.campus_location,
    trade_status: "wait_pay",
    deal_price: dealPrice,
    guarantee_fee: guaranteeFee,
    discount_amount: discountAmount,
    total_amount: totalAmount,
    verify_qr_code: getDemoQr(orderId),
    created_at: new Date().toISOString(),
    paid_at: null,
    completed_at: null,
    cancelled_at: null
  };

  const itemStatus = updateItemStatus(item.item_id, "reserved");
  if (!itemStatus.ok) return itemStatus;

  getOrders().unshift(order);
  return success(order);
}

function transitionOrder(orderId, nextStatus) {
  const order = getOrderById(orderId);
  if (!order) {
    return failure("ORDER_NOT_FOUND", "订单不存在", { orderId });
  }

  const allowed = TRANSITIONS[order.trade_status] || [];
  if (!allowed.includes(nextStatus)) {
    return failure(
      "ORDER_INVALID_TRANSITION",
      "当前订单状态不能完成此操作",
      { current: order.trade_status, next: nextStatus }
    );
  }

  const item = getItemById(order.item_id);
  if (!item) {
    return failure("ITEM_NOT_FOUND", "订单关联商品不存在");
  }

  const now = new Date().toISOString();

  if (nextStatus === "completed") {
    const itemResult = updateItemStatus(item.item_id, "sold");
    if (!itemResult.ok) return itemResult;
    order.completed_at = now;
  }

  if (nextStatus === "cancelled") {
    const itemResult = updateItemStatus(item.item_id, "on_sale");
    if (!itemResult.ok) return itemResult;
    order.cancelled_at = now;
  }

  if (nextStatus === "wait_meetup") {
    order.paid_at = now;
  }

  order.trade_status = nextStatus;
  return success(order);
}

function payDemoOrder(orderId) {
  return transitionOrder(orderId, "wait_meetup");
}

function completeDemoOrder(orderId) {
  return transitionOrder(orderId, "completed");
}

function cancelDemoOrder(orderId) {
  return transitionOrder(orderId, "cancelled");
}

function buildTimeline(status) {
  const paid = status === "wait_meetup" || status === "completed";
  const completed = status === "completed";
  const cancelled = status === "cancelled";

  return [
    { title: "订单已创建", state: "done" },
    {
      title: cancelled ? "订单已取消" : "模拟支付",
      state: cancelled ? "done" : paid ? "done" : "current"
    },
    {
      title: "等待校内面交",
      state: completed ? "done" : paid ? "current" : ""
    },
    {
      title: "交易完成",
      state: completed ? "done" : ""
    }
  ];
}

function getOrderView(orderId) {
  const order = getOrderById(orderId);
  if (!order) {
    return failure("ORDER_NOT_FOUND", "订单不存在", { orderId });
  }

  const item = getItemById(order.item_id);
  if (!item) {
    return failure("ITEM_NOT_FOUND", "订单关联商品不存在");
  }

  return success({
    order,
    item,
    verified: order.trade_status === "completed",
    timeline: buildTimeline(order.trade_status),
    statusLabel: STATUS_LABELS[order.trade_status] || order.trade_status
  });
}

module.exports = {
  TRANSITIONS,
  STATUS_LABELS,
  createDemoOrder,
  payDemoOrder,
  completeDemoOrder,
  cancelDemoOrder,
  getOrderView,
  transitionOrder
};
