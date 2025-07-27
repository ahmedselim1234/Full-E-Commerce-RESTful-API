const mongoose = require("mongoose");

const cartchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "product",
        },
        quantity: { type: Number, default: 1 },
        color: String,
        price: Number,
      },
    ],

    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartchema);
