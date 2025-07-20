const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const { ApiError } = require("../middleware/errorHandler");
const { ApiFeatures } = require("../util/apiFeatures");

exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const newCategory = await Category.create({
    name,
    slug: slugify(name),
  });

  res.status(201).json({ newCategory });
});

exports.getCategories = asyncHandler(async (req, res, next) => {
   const CountOfDocuments = await Category.countDocuments();
  
    const apiFeatures = new ApiFeatures(Category.find(), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate(CountOfDocuments);
  
    const { mongoQuery, paginatetionResult } = apiFeatures;
  
    const categories = await mongoQuery;
  res.status(200).json({ result: categories.length,paginatetionResult:paginatetionResult, data: categories });
});

exports.getSpeceficCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    return next(new ApiError("this category is not exist", 404));
  }
  res.status(200).json({ data: category });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await Category.findById(id);
  if (!category) {
    return next(new ApiError("this category is not exist", 404));
  }

  category.name = name;
  category.slug = slugify(name);
  await category.save();
  res.status(200).json({ data: category });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError("this category is not exist", 404));
  }

  res.status(204).json({ m: "deleted" });
});
