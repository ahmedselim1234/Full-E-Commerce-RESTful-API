const express = require("express");
const couponController = require("../controllers/coupon");
const requireAuth = require("../middleware/isAuth");
const roles = require("../middleware/role");

// const {
//   getCategoryValidator,
//   createCategoryValidator,
//   updateCategoryValidator,
//   deleteCategoryValidator,
// } = require("../util/valedateCategory");

const router = express.Router();

router.use(requireAuth, roles.allowedTo("admin", "manager"));

router
  .route("/")
  .post(couponController.createCoupon)
  .get(couponController.getCoupons);

router
  .route("/:id")
  .get(couponController.getSpeceficCoupon)
  .put(couponController.updateCoupon)
  .delete(couponController.deleteCoupon);

module.exports = router;
