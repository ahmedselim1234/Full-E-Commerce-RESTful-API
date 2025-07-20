const { check } = require("express-validator");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const Category = require("../models/category");
const Subcategory = require("../models/subCategory");
const Brand = require("../models/brandModel");

exports.getProductValidator = [
  check("id").isMongoId().withMessage("invalid category id enter valid "),
  validatorMiddleware,
];

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("title required")
    .isLength({ min: 3 })
    .withMessage("so short")
    .isLength({ max: 100 })
    .withMessage("to long"),

  check("description")
    .notEmpty()
    .withMessage("description is required")
    .isLength({ max: 2000 })
    .withMessage("to long"),
  validatorMiddleware,

  check("quantity").notEmpty().withMessage("quantity is required").isNumeric(),

  check("price").isNumeric().notEmpty().withMessage("price is required"),

  check("sold").isNumeric().withMessage("sold must be number").optional(),

  check("priceAfterDiscount")
    .isNumeric()
    .toFloat()
    .isLength({ max: 100 })
    .withMessage("too long")
    .optional()
    .custom((value, { req }) => {
      if (req.body.price < value || req.body.price === value) {
        throw new Error("priceAfterDiscount must be less than proce ");
      }
    }),

  check("imageCover").notEmpty().withMessage("image Cover is required"),

  check("availableImages")
    .optional()
    .isArray()
    .withMessage("availableImages is array of strings"),

  check("colors")
    .optional()
    .isArray()
    .withMessage("colors is array of strings"),

  check("category")
    .notEmpty()
    .withMessage("category is required")
    .isMongoId()
    .withMessage("invalid id ")
    // eslint-disable-next-line no-shadow
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          
          return Promise.reject(new Error("this  category not exist "));
        }
      })
    ),

check("subcategory")
  .optional()
  .isArray()
  .withMessage("subcategory must be an array")
  .custom(async (subcategoryId, { req }) => {
    const subcategory = await Subcategory.find({ _id: { $in: subcategoryId } });

    if (subcategory.length < 1 || subcategory.length !== subcategoryId.length) {
      return Promise.reject(new Error("this sub category not exist "));
    }

    const categoryId = req.body.category;

    const result = await Subcategory.find({
      _id: { $in: subcategoryId },
      category: categoryId,
    });

    // "One or more subcategories do not belong to the selected category"
    if (result.length < 1 || result.length !== subcategory.length) {
      console.log(result)
      return Promise.reject(new Error( "One or more subcategories do not belong to the selected category")
      );
    }
    // return true;
  }),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("invalid id ")
    .custom((brandId) =>
      Brand.findById(brandId).then((brand) => {
        if (!brand) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject("this brand not exist");
        }
      })
    ),

  check("Averagerating")
    .optional()
    .isNumeric()
    .isLength({ min: 1 })
    .withMessage("Rating must more than or equel 1")
    .isLength({ max: 5 })
    .withMessage("Rating must less than or equel 5"),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be number"),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("so short")
    .isLength({ max: 100 })
    .withMessage("to long"),

  check("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("to long"),
  validatorMiddleware,

  check("quantity").optional().isNumeric(),

  check("price").isNumeric().optional(),

  check("sold").isNumeric().withMessage("sold must be number").optional(),

  check("priceAfterDiscount")
    .isNumeric()
    .toFloat()
    .isLength({ max: 100 })
    .withMessage("too long")
    .optional(),

  check("imageCover").optional(),

  check("availableImages")
    .optional()
    .isArray()
    .withMessage("availableImages is array of strings"),

  check("colors")
    .optional()
    .isArray()
    .withMessage("colors is array of strings"),

  check("category")
    .optional()
    .isMongoId()
    .withMessage("invalid id ")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject("this category not exist");
        }
      })
    ),

  check("subcategory")
    .optional()
    .isMongoId()
    .withMessage("invalid id ")
    .custom((subcategoryId) =>
      Subcategory.find({ _id: { $exists: true, $in: subcategoryId } }).then(
        (subcategory) => {
          console.log(subcategory.length);
        }
      )
    ),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("invalid id ")
    .custom((brandId) =>
      Brand.findById(brandId).then((brand) => {
        if (!brand) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject("this brand not exist");
        }
      })
    ),

  check("Averagerating")
    .optional()
    .isNumeric()
    .isLength({ min: 1 })
    .withMessage("Rating must more than or equel 1")
    .isLength({ max: 5 })
    .withMessage("Rating must less than or equel 5"),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be number"),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("invalid product id"),
  validatorMiddleware,
];
