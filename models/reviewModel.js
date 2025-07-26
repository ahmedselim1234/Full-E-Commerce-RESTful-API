const mongoose = require("mongoose");

const reviewschema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, "min rating is 1 "],
      max: [5, "max rating is 5 "],
      required: [true, "rating is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
      required: [true, "product is required"],
    },
  },
  { timestamps: true }
);



reviewschema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        ratingsCount: { $sum: 1 },
      },
    },
  ]);

  console.log(result.length > 0);

  if (result) {
    await mongoose.model("product").findByIdAndUpdate(productId, {
      Averagerating: result[0].avgRating,
      ratingsQuantity: result[0].ratingsCount,
    });
  } else {
    await mongoose.model("product").findByIdAndUpdate(productId, {
      Averagerating: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewschema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewschema.post("deleteOne", { document: true, query: false }, async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});



reviewschema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "first_name ",
  });
  next();
});

module.exports = mongoose.model("review", reviewschema);
