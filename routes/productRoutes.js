const express = require("express");

// const authController = require("../controllers/auth");
const productController = require("../controllers/product");

const { getProductValidator, createProductValidator,updateProductValidator,deleteProductValidator} = require("../util/productValidator");

const router = express.Router();



router
  .route("/")
  .post(createProductValidator,productController.createProdact)
.get(productController.getProducts);

router
  .route("/:id")
  .get(getProductValidator, productController.getSpeceficproduct)
  .delete(deleteProductValidator,productController.deleteProduct)
  .put(updateProductValidator,productController.updateproduct)

module.exports = router;