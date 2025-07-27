const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: [true, "this category is already exist"],
      minlength: [3, "name to short"],
      maxlength: [20, "too long "],
      trim: true,
    },

    expire: {
      type: Date,
       required: [true, "expire is required"],
    },
    discount: {
      type: Number,
       required: [true, "discount is required"],
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Coupon", CouponSchema);
