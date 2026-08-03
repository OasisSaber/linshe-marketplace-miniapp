const ORDER_SEEDS = [
  {
    order_id: "order_001",
    item_id: "item_003",
    seller_id: "seller_003",
    buyer_id: "buyer_001",
    meetup_location: "图书馆南门",
    trade_status: "wait_meetup",
    deal_price: 630,
    guarantee_fee: 2,
    discount_amount: 2,
    total_amount: 630,
    verify_qr_code: "demo-verify-code:order_001",
    created_at: "2026-07-10T10:00:00.000Z",
    paid_at: "2026-07-10T10:01:00.000Z",
    completed_at: null,
    cancelled_at: null
  }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

let orders = clone(ORDER_SEEDS);

function getOrders() {
  return orders;
}

function getOrderById(orderId) {
  if (!orderId) return null;
  return orders.find((order) => order.order_id === orderId) || null;
}

function resetOrders() {
  orders = clone(ORDER_SEEDS);
  return orders;
}

module.exports = {
  getOrders,
  getOrderById,
  resetOrders
};
