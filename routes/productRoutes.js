const express = require("express");

// const authController = require("../controllers/auth");
const productController = require("../controllers/product");

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../util/productValidator");

const router = express.Router();

router
  .route("/")
  .post(
    productController.uploadProductImages,
    productController.resizeImage,
    createProductValidator,
    productController.createProdact
  )
  .get(productController.getProducts);

router
  .route("/:id")
  .get(getProductValidator, productController.getSpeceficproduct)
  .delete(deleteProductValidator, productController.deleteProduct)
  .put(
    productController.uploadProductImages,
    productController.resizeImage,
    updateProductValidator,
    productController.updateproduct
  );

module.exports = router;
