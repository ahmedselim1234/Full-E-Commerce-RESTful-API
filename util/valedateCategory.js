const { check} = require("express-validator");
const validatorMiddleware = require("../middleware/validatorMiddleware");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id enter valid "),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("name required")
    .isLength({ min: 3 })
    .withMessage("so short")
    .isLength({ max: 32 })
    .withMessage("to long"),
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
