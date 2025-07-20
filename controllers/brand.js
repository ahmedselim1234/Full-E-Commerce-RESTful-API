const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");
const { ApiError } = require("../middleware/errorHandler");
const { ApiFeatures } = require("../util/apiFeatures");

exports.createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const newBrand = await Brand.create({
    name,
    slug: slugify(name),
  });

  res.status(201).json({ newBrand });
});

exports.getBrands = asyncHandler(async (req, res, next) => {
  const CountOfDocuments = await Brand.countDocuments();

  const apiFeatures = new ApiFeatures(Brand.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate(CountOfDocuments);

  const { mongoQuery, paginatetionResult } = apiFeatures;

  const brands = await mongoQuery;

  res.status(200).json({ result: brands.length,paginatetionResult:paginatetionResult, data: brands });
});

exports.getSpeceficBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);
  if (!Brand) {
    return next(new ApiError("this Brand is not exist", 404));
  }
  res.status(200).json({ data: brand });
});

exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new ApiError("this Brand is not exist", 404));
  }

  brand.name = name;
  brand.slug = slugify(name);
  await brand.save();
  res.status(200).json({ data: brand });
});

exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError("this Brand is not exist", 404));
  }

  res.status(200).json({ deleted: brand });
});
