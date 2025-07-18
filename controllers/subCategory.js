const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const subCategory = require("../models/subCategory");
const { ApiError } = require("../middleware/errorHandler");

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
  const page = req.query.page || 1;
  const limit = 2;
  const skip = limit * (page - 1);
  const filter = req.params.categoryId
    ? { category: req.params.categoryId }
    : {};
  console.log(req.params.categoryId);

  const thetheSubCategories = await subCategory
    .find(filter)
    .limit(limit)
    .skip(skip);
  //   .populate({
  //     path: "category",
  //     select: "name -_id",
  //   });
  res
    .status(200)
    .json({
      page: page,
      length: thetheSubCategories.length,
      SubCategories: thetheSubCategories,
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
