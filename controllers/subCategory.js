// const slugify = require("slugify");
// const asyncHandler = require("express-async-handler");
const subCategory = require("../models/subCategory");
// const { ApiError } = require("../middleware/errorHandler");
// const { ApiFeatures } = require("../util/apiFeatures");
const factoryHandlers=require('./handlersFactory')

// i will use it as a middleware to solve set the validation in createSubCategory before set categoryId as a body
exports.setCategoryIdBeforeValidation = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createSubCategory = factoryHandlers.createDocument(subCategory);

exports.getSubCategory = factoryHandlers.getSpeceficDocument(subCategory);

exports.getSubCategories = factoryHandlers.getALLDocument(subCategory);

exports.updateSubCategory = factoryHandlers.updateDocument(subCategory);

exports.deleteSubCategory = factoryHandlers.deleteFactoey(subCategory);
