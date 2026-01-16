const express = require("express");
const cartController = require("../controllers/Cart");
const requireAuth = require("../middleware/isAuth");
const roles = require("../middleware/role");


// const {
//   getCategoryValidator,
//   createCategoryValidator,
//   updateCategoryValidator,
//   deleteCategoryValidator,
// } = require("../util/valedateCategory");

const router = express.Router();

router.use(requireAuth, roles.allowedTo("client"));

router
  .route("/")
  .post(cartController.addproductToCart)
  .get(cartController.getLoggedUserCart);

router
  .route("/:itemId")
  .delete(cartController.deleteItemForLoggedUserCart)
  .put(cartController.updateCartItemQuantity);

router.route("/applayCoupon").post(cartController.applayCoupon);

module.exports = router;
