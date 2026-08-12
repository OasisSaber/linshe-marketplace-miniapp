const { getItemById } = require("./items");
const {
  createDemoOrder,
  payDemoOrder,
  cancelDemoOrder
} = require("./orders");
const { success, failure } = require("./result");

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function getCheckoutQuote(itemId, rawOfferPrice, options) {
  const config = options || {};
  const item = getItemById(itemId);
  if (!item) {
    return failure("ITEM_NOT_FOUND", "商品不存在", { itemId });
  }
  if (item.status !== "on_sale") {
    return failure("ITEM_NOT_AVAILABLE", "商品当前不可结算", {
      itemId,
      status: item.status
    });
  }

  const hasOffer = rawOfferPrice !== undefined
    && rawOfferPrice !== null
    && String(rawOfferPrice).trim() !== "";
  const offerPrice = hasOffer ? Number(rawOfferPrice) : item.price;

  if (!Number.isFinite(offerPrice) || offerPrice <= 0 || offerPrice > item.price) {
    return failure("OFFER_PRICE_INVALID", "出价至少为 0.01 且不能高于商品标价", {
      itemId,
      offerPrice: rawOfferPrice,
      listPrice: item.price
    });
  }

  const dealPrice = roundMoney(offerPrice);
  if (dealPrice <= 0) {
    return failure("OFFER_PRICE_INVALID", "出价至少为 0.01", {
      itemId,
      offerPrice: rawOfferPrice,
      listPrice: item.price
    });
  }
  const guaranteeFee = roundMoney(config.guaranteeFee == null ? 2 : config.guaranteeFee);
  const discountAmount = roundMoney(config.discountAmount == null ? 2 : config.discountAmount);
  const total = roundMoney(dealPrice + guaranteeFee - discountAmount);

  if (!Number.isFinite(guaranteeFee) || guaranteeFee < 0
      || !Number.isFinite(discountAmount) || discountAmount < 0
      || !Number.isFinite(total) || total < 0) {
    return failure("CHECKOUT_TOTAL_INVALID", "结算金额无效");
  }

  return success({
    item,
    dealPrice,
    guaranteeFee,
    discountAmount,
    total,
    meetupLocation: config.meetupLocation || item.campus_location
  });
}

function createAndPayDemoOrder(payload, operations) {
  const actions = operations || {};
  const create = actions.createDemoOrder || createDemoOrder;
  const pay = actions.payDemoOrder || payDemoOrder;
  const cancel = actions.cancelDemoOrder || cancelDemoOrder;

  const created = create(payload);
  if (!created.ok) return created;

  const paid = pay(created.data.order_id);
  if (paid.ok) return paid;

  const recovery = cancel(created.data.order_id);
  if (recovery.ok) {
    return failure(
      "ORDER_PAYMENT_FAILED",
      "Demo 支付失败，订单已自动取消并恢复商品",
      {
        orderId: created.data.order_id,
        recovered: true,
        cause: paid.error
      }
    );
  }

  return failure(
    "ORDER_PAYMENT_RECOVERY_FAILED",
    "Demo 支付失败，且订单恢复未完成",
    {
      orderId: created.data.order_id,
      recovered: false,
      cause: paid.error,
      recoveryError: recovery.error
    }
  );
}

module.exports = {
  getCheckoutQuote,
  createAndPayDemoOrder
};
