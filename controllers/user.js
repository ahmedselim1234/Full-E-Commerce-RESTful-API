
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const slugify = require("slugify");
const factoryHandlers = require("./handlersFactory");
const User = require("../models/user");
const { uploadOneImage } = require("../middleware/uploadImage");
const { ApiError } = require("../middleware/errorHandler");
const generateToken = require("./generateToken");


exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/user/${filename}`);

    //save in db
    req.body.profileImage = filename;
  }

  next();
});

exports.userProfileImage = uploadOneImage("profileImage");

exports.createUser = factoryHandlers.createDocument(User);

exports.getUsers = factoryHandlers.getALLDocument(User);

exports.getSpeceficUser = factoryHandlers.getSpeceficDocument(User);

// you can update all fiels with out password
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(
    { _id: id },
    {
      first_name: req.body.first_name,
      slug: slugify(req.body.first_name),
      email: req.body.email,
      role: req.body.role,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      active: req.body.active,
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError("this document is not exist", 404));
  }

  res.status(201).json({ update: user });
});

exports.deleteUser = factoryHandlers.deleteFactoey(User);

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});
// admin
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.newPassword, 10),
      updatedAt: Date.now(),
    },
    { new: true }
  );
  if (!document) return next(new Error("user not found "));
  res.status(200).json({ data: document });
});

// logged user
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      dateOfChangePassword: Date.now(),
    },
    { new: true }
  );
  const accessToken = generateToken.accessToken(user);
  const refreshToken = generateToken.refreshToken(user);

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.status(200).json({ data: user, token: accessToken });
});

// update data for user
exports.updateLoggedUserInfo = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      first_name: req.body.first_name,
      slug: req.body.slug,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      email: req.body.email,
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError("this document is not exist", 404));
  }

  res.status(201).json({ update: user });
});
