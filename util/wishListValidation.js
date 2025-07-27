const { check } = require("express-validator");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const Product = require("../models/product");

exports.createWishListValidator = [
  check("product")
    .isMongoId()
    .withMessage("invalid category id")
    .custom(async (id) => {
      const productIsExist = await Product.findById(id);
      if(!productIsExist){
         throw new Error("this product is not exist");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.deleteRviewValidator = [
  check("id").isMongoId().withMessage("invalid category id"),

  validatorMiddleware,
];
