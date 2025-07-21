// const slugify = require("slugify");
// const asyncHandler = require("express-async-handler");
// const { ApiFeatures } = require("../util/apiFeatures");
// const { ApiError } = require("../middleware/errorHandler");
const Product = require("../models/product");
const factoryHandlers = require("./handlersFactory");

exports.createProdact=factoryHandlers.createDocument(Product);


exports.getProducts=factoryHandlers.getALLDocument(Product,"Products");

exports.getSpeceficproduct=factoryHandlers.getSpeceficDocument(Product);


exports.updateproduct=factoryHandlers.updateDocument(Product);


exports.deleteProduct = factoryHandlers.deleteFactoey(Product);
