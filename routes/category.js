const express = require("express");

const authController = require("../controllers/category");

const { getCategoryValidator, createCategoryValidator,updateCategoryValidator,deleteCategoryValidator} = require("../util/valedateCategory");

const router = express.Router();

router
  .route("/")
  .post(createCategoryValidator,authController.createCategory)
  .get(authController.getCategories);

router
  .route("/:id")
  .get(getCategoryValidator, authController.getSpeceficCategory)
  .put(updateCategoryValidator,authController.updateCategory)
  .delete(deleteCategoryValidator,authController.deleteCategory);

module.exports = router;