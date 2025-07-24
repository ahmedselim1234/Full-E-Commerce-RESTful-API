const express = require("express");

// const authController = require("../controllers/auth");
const requireAuth = require("../middleware/isAuth");
const roles = require("../middleware/role");

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
    requireAuth,
    roles.allowedTo("admin", "manager"),
    productController.uploadProductImages,
    productController.resizeImage,
    createProductValidator,
    productController.createProdact
  )
  .get(productController.getProducts);

router
  .route("/:id")
  .get(getProductValidator, productController.getSpeceficproduct)
  .delete(
    requireAuth,
    roles.allowedTo("admin"),
    deleteProductValidator,
    productController.deleteProduct
  )
  .put(
    requireAuth,
    roles.allowedTo("admin", "manager"),
    productController.uploadProductImages,
    productController.resizeImage,
    updateProductValidator,
    productController.updateproduct
  );

module.exports = router;
