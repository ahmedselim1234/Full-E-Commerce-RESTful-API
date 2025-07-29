// eslint-disable-next-line import/no-extraneous-dependencies
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../middleware/errorHandler");
const Cart = require("../models/cart");
const Product = require("../models/product");
// const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const factoryHandlers = require("./handlersFactory");

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  //1) get cart depend on cart id
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError(`no cart for this id ${req.params.cartId}`, 400));
  }
  //get order price depend on cart price => check if have coupon
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // creating order with defualt payment => cash
  const order = await Order.create({
    user: req.user.id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });
  //increment sold decrement decremnt order quantity
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOption, {});
    //clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({ order });
});

//client
exports.getOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  const order = await Order.find({ user: req.user.id });
  res.status(200).json(order);
});

//admin
exports.getAllOrders = factoryHandlers.getALLDocument(Order);

//admin
exports.getSpeceficOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(
      new ApiError(`no order for this id ${req.params.orderId}`, 400)
    );
  }
  res.status(200).json(order);
});

exports.updateOrderToPay = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(
      new ApiError(`no order for this id ${req.params.orderId}`, 400)
    );
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();
  res.status(200).json(order);
});

exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(
      new ApiError(`no order for this id ${req.params.orderId}`, 400)
    );
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  await order.save();
  res.status(200).json(order);
});

//get checkout session from stripe and send it as response
exports.checkOutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  //1) get cart depend on cart id
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError(`no cart for this id ${req.params.cartId}`, 400));
  }
  //get order price depend on cart price => check if have coupon
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  //create check out session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: Math.round(totalOrderPrice * 100),
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: String(cart._id),
    metadata: req.body.shippingAddress, 
  });

  res.status(200).json({ session });
});
