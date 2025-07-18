const express = require("express");

// const authController = require("../controllers/auth");
const brandController = require("../controllers/brand");

const { getCategoryValidator, createCategoryValidator,updateCategoryValidator,deleteCategoryValidator} = require("../util/valedateCategory");

const router = express.Router();

router
  .route("/")
  .post(createCategoryValidator,brandController.createBrand)
  .get(brandController.getBrands);

router
  .route("/:id")
  .get(getCategoryValidator, brandController.getSpeceficBrand)
  .put(updateCategoryValidator,brandController.updateBrand)
  .delete(deleteCategoryValidator,brandController.deleteBrand);

module.exports = router;