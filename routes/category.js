const express = require("express");

// const authController = require("../controllers/auth");
const categoryController = require("../controllers/category");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../util/valedateCategory");

const router = express.Router();

const subCategoryRoute = require("./subCategory");

router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .post(
    categoryController.uploadCategoryImage,
    categoryController.resizeImage,
    createCategoryValidator,
    categoryController.createCategory
  )
  .get(categoryController.getCategories);

router
  .route("/:id")
  .get(getCategoryValidator, categoryController.getSpeceficCategory)
  .put(
    categoryController.uploadCategoryImage,
    categoryController.resizeImage,
    updateCategoryValidator,
    categoryController.updateCategory
  )
  .delete(deleteCategoryValidator, categoryController.deleteCategory);

module.exports = router;
