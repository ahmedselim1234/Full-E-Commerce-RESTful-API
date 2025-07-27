const asyncHandler = require("express-async-handler");
const User = require("../models/user");


exports.addProductToWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: { wishList: req.body.product },
    },
    { new: true }
  );

  res.status(200).json({ user, data: user.wishList });
});

exports.removeProductToWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $pull: { wishList: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({ user });
});

exports.getLoggedUserWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("wishList");
  res.status(200).json({ list: user.wishList });
});
