const slugify = require("slugify");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");

exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const newCategory = await Category.create({
    name,
    slug: slugify(name),
  });

  res.status(201).json({ newCategory });
});

exports.getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = 3;
  const skip = limit * (page - 1);
  const categories = await Category.find().skip(skip).limit(limit);
  res.status(200).json({ result: categories.length, data: categories });
});

exports.getSpeceficCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) return res.status(404).json({ m: "not found category" });
  res.status(200).json({ data: category });
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await Category.findById(id);
  if (!category) return res.status(404).json({ m: "not found category" });

  category.name = name;
  category.slug = slugify(name);
  await category.save();
  res.status(200).json({ data: category });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) return res.status(404).json({ m: "not found category" });

  res.status(204).json({ m: "deleted" });
});
