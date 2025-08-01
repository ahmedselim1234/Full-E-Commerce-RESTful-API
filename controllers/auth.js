const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");
// eslint-disable-next-line import/no-extraneous-dependencies, no-unused-vars
const { v4: uuidv4 } = require("uuid");
// eslint-disable-next-line import/no-extraneous-dependencies, no-unused-vars
const sharp = require("sharp");
// const asyncHandler = require("express-async-handler");
const sendEmail = require("../util/sendEmail");
const User = require("../models/user"); 
const generateToken = require("./generateToken");

exports.signup = async (req, res, next) => {
  // eslint-disable-next-line camelcase
  const { first_name, email, password } = req.body;
  // eslint-disable-next-line camelcase
  if (!first_name || !email || !password)
    return res.json({ m: "fill all fields" });

  req.body.slug = slugify(req.body.first_name);
  console.log(req.body.slug);

  try {
    const user = await User.findOne({ email: email });
    if (user) return res.json({ m: "this email is already exist" });

    const createUser = await User.create(req.body);

    const accessToken = generateToken.accessToken(createUser);
    const refreshToken = generateToken.refreshToken(createUser);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({ accessToken, email, password ,createUser});
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return res.json({ message: "fill all fields" });

  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.json({ m: "this email is not  exist" });
    console.log(password)
    const comparePassword = await bcrypt.compare(password, user.password);
    console.log(comparePassword)
    if (!comparePassword) return res.json({ m: "enter a valid password " });

    const accessToken = generateToken.accessToken(user);
    const refreshToken = generateToken.refreshToken(user);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({ accessToken, email, password ,user});
  } catch (err) {
    console.log(err);
  }
};


exports.refresh = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) return res.json({ m: "un auth" });

  jwt.verify(token, process.env.REFREESH_TOKEN_SECRET, async (err, decode) => {
    if (err) return res.json({ m: "forbidden" });

    const user = await User.findById(decode.userInfo.id);
    console.log(user);

    if (!user) return res.status(401).json({ message: "unAuth" });

    const accessToken = generateToken.accessToken(user);

    res.json({ accessToken });
  });
};

exports.logout = (req, res, next) => {
  res.clearCookie("jwt", {
    HttpOnly: true,
    sameSite: "none",
  });
  res.json({ message: "logged out" });
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.json({ m: "this email is not exist" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    user.passwordResetCode = hashedCode;
    user.expireResetCode = Date.now() + 60 * 10 * 1000;
    user.verifyResetCode = false;

    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: "your reset code ",
        message: `hi ${user.first_name} \n your reset code is \n ${resetCode} `,
      });
    } catch (err) {
      user.passwordResetCode = undefined;
      user.expireResetCode = undefined;
      user.verifyResetCode = undefined;
      await user.save();
      res.json({ m: "error when sending email" });
    }

    res.json({ message: "the code is sent" });
  } catch (err) {
    console.log(err);
  }
};

exports.verifyResetCode = async (req, res, next) => {
  const { enteredCode } = req.body;

  try {
    const hashedCode = await crypto
      .createHash("sha256")
      .update(enteredCode)
      .digest("hex");
    const user = await User.findOne({
      passwordResetCode: hashedCode,
      expireResetCode: { $gt: Date.now() },
    });
    if (!user) return res.json({ m: "code invalid or expired" });
    user.verifyResetCode = true;
    console.log(user);

    await user.save();
    return res.json({ message: "success" });
  } catch (err) {
    console.log(err);
  }
};

exports.addNewPassword = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user.verifyResetCode === false)
      return res.status(400).json({ m: "enter the reset code " });
    if (!user) return res.json({ m: "enter valid email" });

    user.password = password;
    user.passwordResetCode = undefined;
    user.expireResetCode = undefined;
    user.verifyResetCode = undefined;
    await user.save();

    res.json({ m: "password changed successfully" });
  } catch (err) {
    console.log(err);
  }
};
