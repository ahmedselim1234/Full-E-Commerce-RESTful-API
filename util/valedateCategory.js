const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../middleware/validatorMiddleware");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id enter valid "),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("name required!")
    .isLength({ min: 3 })
    .withMessage("too short")
    .isLength({ max: 32 })
    .withMessage("too long")
    .custom((val, { req }) => {
      console.log(val)
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  validatorMiddleware,
];
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  validatorMiddleware,
];
