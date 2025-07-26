const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      // unique: [true, "this title is already exist"],
      minlength: [3, "name to short"],
      maxlength: [100, "too long "],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      maxlength: [2000, "description to long"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    priceAfterDiscount: {
      type: Number,
      trim: true,
      max: [100000, "too long "],
    },
    colors: [String],
    imageCover: {
      required: [true, "image Cover is required"],
      type: String,
    },
    availableImages: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "catgory",
      required: [true, "catgory is required"],
    },
    subcategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
        //   required: [true, "subCategory is required"],
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "brand",
      //   required: [true, "brand is required"],
    },
    Averagerating: {
      type: Number,
      min: [1, "Rating must more than or equel 1"],
      max: [5, "Rating must less than or equel 5"],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "review",
  foreignField: "product",
  localField: "_id",
});


productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});
//generate url
const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
    console.log(doc.imageCover);
  }
  if (doc.availableImages) {
    const imagesList = [];
    doc.availableImages.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(imageUrl);
    });
    doc.availableImages = imagesList;
    console.log(doc.availableImages);
  }
};
productSchema.post("init", (doc) => {
  setImageUrl(doc);
});
productSchema.post("save", (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model("product", productSchema);
