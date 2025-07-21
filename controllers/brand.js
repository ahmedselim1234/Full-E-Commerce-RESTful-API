// const slugify = require("slugify");
// const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");
// const { ApiError } = require("../middleware/errorHandler");
// const { ApiFeatures } = require("../util/apiFeatures");
const factoryHandlers=require('./handlersFactory')

exports.createBrand =factoryHandlers.createDocument(Brand);

exports.getBrands=factoryHandlers.getALLDocument(Brand);

exports.getSpeceficBrand=factoryHandlers.getSpeceficDocument(Brand);


exports.updateBrand =factoryHandlers.updateDocument(Brand);


exports.deleteBrand =factoryHandlers.deleteFactoey(Brand);

