const express = require("express");

// const authController = require("../controllers/auth");
const brandController = require("../controllers/brand");
const requireAuth = require("../middleware/isAuth");
const roles = require("../middleware/role");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../util/valedateCategory");

const router = express.Router();

router
  .route("/")
  .post(
    requireAuth,
    roles.allowedTo("admin", "manager"),
    brandController.uploadBrandImage,
    brandController.resizeImage,
    createCategoryValidator,
    brandController.createBrand
  )
  .get(brandController.getBrands);

router
  .route("/:id")
  .get(getCategoryValidator, brandController.getSpeceficBrand)
  .put(
    requireAuth,
    roles.allowedTo("admin", "manager"),
    brandController.uploadBrandImage,
    brandController.resizeImage,
    updateCategoryValidator,
    brandController.updateBrand
  )
  .delete(
    requireAuth,
    roles.allowedTo("admin"),
    deleteCategoryValidator,
    brandController.deleteBrand
  );

module.exports = router;
