const express = require("express");

const authController = require("../controllers/category");

const router = express.Router();

router
  .route("/")
  .post(authController.createCategory)
  .get(authController.getCategories);

router.route("/:id").get(authController.getSpeceficCategory).put(authController.updateCategory).delete(authController.deleteCategory);

module.exports = router;
