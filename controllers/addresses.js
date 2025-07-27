const asyncHandler = require("express-async-handler");
const User = require("../models/user");


exports.addAdress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: { addresses: req.body},
    },
    { new: true }
  );

  res.status(200).json({ address: user.addresses });
});

exports.removeAdress  = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $pull: { addresses: {_id:req.params.addressId} },
    },
    { new: true }
  );

  res.status(200).json({user: user.addAdress });
});

exports.getLoggedUserAdress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("addresses");
  res.status(200).json({ list: user.addresses });
});
