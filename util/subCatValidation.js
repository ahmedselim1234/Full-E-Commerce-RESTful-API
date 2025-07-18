const { check } = require("express-validator");
const validatorMiddleware = require("../middleware/validatorMiddleware");


exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id enter valid "),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("name required")
    .isLength({ min: 2 })
    .withMessage("so short")
    .isLength({ max: 32 })
    .withMessage("to long"),
    check("category").notEmpty().withMessage("sub must be belong to category").isMongoId().withMessage("invalid category id"),
  validatorMiddleware,
];
exports.updateSubCategoryValidator = [
   check("id").isMongoId().withMessage("invalid category id"),
   check("name")
    .notEmpty()
    .withMessage("name required")
    .isLength({ min: 2 })
    .withMessage("so short")
    .isLength({ max: 32 })
    .withMessage("to long"),
  validatorMiddleware,
];
// exports.deleteCategoryValidator = [
//    check("id").isMongoId().withMessage("invalid category id"),
//   validatorMiddleware,
// ];
