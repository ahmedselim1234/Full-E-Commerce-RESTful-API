const factoryHandlers = require("./handlersFactory");

const Review = require("../models/reviewModel");
//aplaying nested route for get  for post 
exports.setProductIdBeforeValidation = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factoryHandlers.createDocument(Review);

//aplaying nested route for get 
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) {
    filterObject = { product: req.params.productId };
  }
  req.filterObject = filterObject;
  next();
};
exports.getReviews = factoryHandlers.getALLDocument(Review);

exports.getSpeceficReview = factoryHandlers.getSpeceficDocument(Review);

exports.updateReview = factoryHandlers.updateDocument(Review);

exports.deleteReview = factoryHandlers.deleteFactoey(Review);
