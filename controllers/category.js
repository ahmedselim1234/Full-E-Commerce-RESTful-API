// const slugify = require("slugify");
// const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
// const { ApiError } = require("../middleware/errorHandler");
// const { ApiFeatures } = require("../util/apiFeatures");
const factoryHandlers=require('./handlersFactory')

exports.createCategory =factoryHandlers.createDocument(Category)

exports.getCategories=factoryHandlers.getALLDocument(Category);


exports.getSpeceficCategory=factoryHandlers.getSpeceficDocument(Category);



exports.updateCategory =factoryHandlers.updateDocument(Category)


exports.deleteCategory =factoryHandlers.deleteFactoey(Category)
