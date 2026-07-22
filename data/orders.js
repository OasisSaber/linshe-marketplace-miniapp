const orders = [
  {
    order_id: "order_001",
    item_id: "item_003",
    buyer_id: "buyer_001",
    meetup_location: "图书馆南门",
    trade_status: "wait_meetup",
    verify_qr_code: "data:image/png;base64,"
  }
];

function getOrders() {
  return orders;
}

function getOrderById(orderId) {
  return orders.find((order) => order.order_id === orderId) || orders[0];
}

module.exports = {
  getOrders,
  getOrderById
};
