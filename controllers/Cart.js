const asyncHandler = require("express-async-handler");
const { ApiError } = require("../middleware/errorHandler");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/couponModel");

exports.addproductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await Product.findById(productId);
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    const productIndex = await cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  //total cart price
  // eslint-disable-next-line arrow-body-style
  const totalPrice = cart.cartItems.reduce((acc, current) => {
    return acc + current.quantity * parseFloat(current.price);
  }, 0);

  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;

  await cart.save();
  res.status(200).json({ cart });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  console.log(cart);
  if (!cart) return res.status(200).json({ message: "not cart fo this user" });

  res.status(200).json({ cart });
});

exports.deleteItemForLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  if (!cart) {
    return res
      .status(404)
      .json({ message: "Cart not found or item not deleted" });
  }

  // eslint-disable-next-line arrow-body-style
  const totalPrice = cart.cartItems.reduce((acc, current) => {
    return acc + current.quantity * parseFloat(current.price);
  }, 0);

  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;

  await cart.save();

  res.status(200).json({ cart });
});

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ApiError("no cart for this user", 400));
  }

  const productIndex = await cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  if (productIndex > -1) {
    const cartItem = cart.cartItems[productIndex];

    cartItem.quantity = quantity;
    cart.cartItems[productIndex] = cartItem;
  } else {
    return next(new ApiError("no item for this id ", 400));
  }

  // eslint-disable-next-line arrow-body-style
  const totalPrice = cart.cartItems.reduce((acc, current) => {
    return acc + current.quantity * parseFloat(current.price);
  }, 0);

  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  await cart.save();

  res.status(200).json({ cart });
});

exports.applayCoupon = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  const coupon = await Coupon.findOne({
    name: req.body.couponName,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("invalid or expired coupon", 400));
  }

  const discount = cart.totalCartPrice * (coupon.discount / 100);
  cart.totalPriceAfterDiscount = (cart.totalCartPrice - discount).toFixed(2);

  await cart.save();
  res.status(200).json({ cart });
});
