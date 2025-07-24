const express = require("express");
const requireAuth = require("../middleware/isAuth");
const roles = require("../middleware/role");

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
    requireAuth,
    roles.allowedTo("admin", "manager"),
    subCategoryController.setCategoryIdBeforeValidation,
    createSubCategoryValidator,
    subCategoryController.createSubCategory
  )
  .get(subCategoryController.getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, subCategoryController.getSubCategory)
  .put(
    requireAuth,
    roles.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    subCategoryController.updateSubCategory
  )
  .delete(
    requireAuth,
    roles.allowedTo("admin"),
    subCategoryController.deleteSubCategory
  );

module.exports = router;
