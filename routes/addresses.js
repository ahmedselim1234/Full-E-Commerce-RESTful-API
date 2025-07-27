const express = require("express");
const requireAuth = require("../middleware/isAuth");
const roles = require("../middleware/role");

const addressController = require("../controllers/addresses");

// const {
// createWishListValidator
// } = require("../util/wishListValidation");

const router = express.Router();

router
  .route("/")
  .post(
    requireAuth,
    roles.allowedTo("client"),
    addressController.addAdress
).get(requireAuth,roles.allowedTo("client"),addressController.getLoggedUserAdress);

router
  .route("/:addressId")
  .delete(
    requireAuth,
    roles.allowedTo("client"),
    addressController.removeAdress
);



module.exports = router;
