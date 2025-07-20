const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const { ApiFeatures } = require("../util/apiFeatures");
const { ApiError } = require("../middleware/errorHandler");

exports.createProdact = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);

  const newProduct = await Product.create(req.body);

  res.status(201).json({ newProduct });
});

exports.getProducts = asyncHandler(async (req, res, next) => {
 
    const CountOfDocuments= await Product.countDocuments()

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .filter()
    .search("Product")
    .sort()
    .limitFields()
    .paginate(CountOfDocuments);

    const {mongoQuery,paginatetionResult}=apiFeatures;

    const products = await mongoQuery;

  

  res.status(200).json({ result: products.length,paginatetionResult:paginatetionResult, data: products });
});


exports.getSpeceficproduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate({
    path: "category",
    select: "name -_id",
  });
  if (!product) {
    return next(new ApiError("this product is not exist", 404));
  }
  res.status(200).json({ data: product });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError("this product is not exist", 404));
  }

  res.status(204).json({ m: "deleted" });
});

exports.updateproduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError("this product is not exist", 404));
  }
  res.status(200).json({ data: product });
});
