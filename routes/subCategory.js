const express = require("express");

const subCategoryController = require("../controllers/subCategory");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
} = require("../util/subCatValidation");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    subCategoryController.setCategoryIdBeforeValidation,
    createSubCategoryValidator,
    subCategoryController.createSubCategory
  )
  .get(subCategoryController.getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, subCategoryController.getSubCategory)
  .put(updateSubCategoryValidator, subCategoryController.updateSubCategory)
  .delete(subCategoryController.deleteSubCategory);

module.exports = router;
