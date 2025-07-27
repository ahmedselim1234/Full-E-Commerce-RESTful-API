const express = require("express");
const requireAuth = require("../middleware/isAuth");
const roles = require("../middleware/role");

const wishLisController = require("../controllers/wishList");

const {
createWishListValidator
} = require("../util/wishListValidation");

const router = express.Router();

router
  .route("/")
  .post(
    requireAuth,
    roles.allowedTo("client"),
    createWishListValidator,
    wishLisController.addProductToWishList
).get(requireAuth,roles.allowedTo("client"),wishLisController.getLoggedUserWishList);

router
  .route("/:productId")
  .delete(
    requireAuth,
    roles.allowedTo("client"),
    // createWishListValidator,
    wishLisController.removeProductToWishList
);



module.exports = router;
