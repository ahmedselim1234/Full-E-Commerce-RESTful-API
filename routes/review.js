const express = require("express");
const reviewController = require("../controllers/review");
const requireAuth = require("../middleware/isAuth");
const roles = require("../middleware/role");

const {
  // getCategoryValidator,
  createreviewValidator,
  updatereviewValidator,
deleteRviewValidator,
// getreviewValidator
} = require("../util/revwie");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    requireAuth,
    roles.allowedTo("client"),
    reviewController.setProductIdBeforeValidation,
    createreviewValidator,
    reviewController.createReview
  )
  .get(reviewController.createFilterObject,reviewController.getReviews);

router
  .route("/:id")
  .get(reviewController.getSpeceficReview)
  .put(
    requireAuth,
    roles.allowedTo("client"),
    updatereviewValidator,
    reviewController.updateReview
  ) 
  .delete(
    requireAuth,
    roles.allowedTo("admin", "client"),
    deleteRviewValidator,
    reviewController.deleteReview
  );

module.exports = router;
