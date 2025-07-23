const express = require("express");

// const authController = require("../controllers/auth");
const brandController = require("../controllers/brand");

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
    brandController.uploadBrandImage,
    brandController.resizeImage,
    updateCategoryValidator,
    brandController.updateBrand
  )
  .delete(deleteCategoryValidator, brandController.deleteBrand);

module.exports = router;
