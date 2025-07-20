const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const subCategory = require("../models/subCategory");
const { ApiError } = require("../middleware/errorHandler");
const { ApiFeatures } = require("../util/apiFeatures");

// i will use it as a middleware to solve set the validation in createSubCategory before set categoryId as a body
exports.setCategoryIdBeforeValidation = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;

  const newSubCategory = await subCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ newSubCategory });
});

exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const theSubCategory = await subCategory.findById(id);
  //   .populate({
  //     path: "category",
  //     select: "name -_id",
  //   });

  if (!theSubCategory) return next(ApiError("this category nit found", 400));
  res.status(200).json({ theSubCategory });
});

exports.getSubCategories = asyncHandler(async (req, res, next) => {
  const CountOfDocuments = await subCategory.countDocuments();

  const apiFeatures = new ApiFeatures(subCategory.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate(CountOfDocuments);

  const { mongoQuery, paginatetionResult } = apiFeatures;

  const scategories = await mongoQuery;
  
  res.status(200).json({
    length: scategories.length,
    SubCategories: scategories,
    paginatetionResult: paginatetionResult,
  });
});

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const updatedsubcategory = await subCategory.findByIdAndUpdate(
    id,
    {
      name,
      slug: slugify(name),
      category,
    },
    { new: true } // return after update
  );

  if (!updatedsubcategory) {
    return next(new ApiError("this category is not exist", 404));
  }

  res.status(200).json({ updated: updatedsubcategory });
});

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deletedSub = await subCategory.findByIdAndDelete(id);
  if (!deletedSub) {
    return next(new ApiError("this category is not exist", 404));
  }
  res.status(204).json({ m: "deleted" });
});
