
const subCategory = require("../models/subCategory");
const factoryHandlers=require('./handlersFactory')

exports.setCategoryIdBeforeValidation = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createSubCategory = factoryHandlers.createDocument(subCategory);

exports.getSubCategory = factoryHandlers.getSpeceficDocument(subCategory);

exports.getSubCategories = factoryHandlers.getALLDocument(subCategory);

exports.updateSubCategory = factoryHandlers.updateDocument(subCategory);

exports.deleteSubCategory = factoryHandlers.deleteFactoey(subCategory);
