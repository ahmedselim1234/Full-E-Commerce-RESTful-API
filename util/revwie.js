const { check } = require("express-validator");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const Review = require("../models/reviewModel");

exports.getreviewValidator = [
  check("id").isMongoId().withMessage("invalid review id enter valid "),
  validatorMiddleware,
];

exports.createreviewValidator = [
  check("content").optional(),

  check("rating")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("min rating is 1 and max is 5"),

  check("user")
    .isMongoId()
    .withMessage("invalid user id enter valid ")
    .notEmpty()
    .withMessage("user is required")
    .custom(async (val, { req }) => {
      // console.log(req.user.id);
      // console.log(val);
      if (req.user.id !== val) {
        throw new Error("not match user");
      }
      return true;
    }),

  check("product")
    .isMongoId()
    .withMessage("invalid product id enter valid ")
    .notEmpty()
    .withMessage("user is required")
    .custom(async (val, { req }) => {
      const ckeck = await Review.findOne({
        user: req.user.id,
        product: req.body.product,
      });
      // console.log(ckeck)
      if (ckeck) {
        throw new Error("you already have a review");
      }

      return true;
    }),

  validatorMiddleware,
];

exports.updatereviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid category id")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) throw new Error("this review not exist ");

      if (!review.user.equals(req.user.id))
        throw new Error("this review not  for this user ");
      return true;
    }),

  check("content").optional(),

  check("rating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("min rating is 1 and max is 5"),

  check("user")
    .isMongoId()
    .withMessage("invalid user id enter valid ")
    .optional()
    .custom(async (val, { req }) => {
      // console.log(req.user.id);
      // console.log(val);
      if (req.user.id !== val) {
        throw new Error("not match user");
      }
      return true;
    }),

  check("product")
    .isMongoId()
    .withMessage("invalid product id enter valid ")
    .optional()
    .custom(async (val, { req }) => {
      const ckeck = await Review.findOne({
        user: req.user.id,
        product: req.body.product,
      });

      if (ckeck) {
        throw new Error("you already have a review");
      }

      return true;
    }),

  validatorMiddleware,
];

exports.deleteRviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid category id")
    .custom(async (val, { req }) => {

      const review = await Review.findById(val);
      if (!review) throw new Error("this review not exist ");

      if (req.user.role === "client") {
        if (!review.user.equals(req.user.id))
          throw new Error("this review not  for this user ");
      }

      return true;
    }),
  validatorMiddleware,
];
