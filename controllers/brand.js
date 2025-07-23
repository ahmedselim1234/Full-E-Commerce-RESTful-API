
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const factoryHandlers=require('./handlersFactory')

const Brand = require("../models/brandModel");
const {uploadOneImage}=require("../middleware/uploadImage");



exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brand/${filename}`);

  //save in db
  req.body.image = filename;

  next();
});

exports.uploadBrandImage =uploadOneImage('image')

exports.createBrand = factoryHandlers.createDocument(Brand);

exports.getBrands=factoryHandlers.getALLDocument(Brand);

exports.getSpeceficBrand=factoryHandlers.getSpeceficDocument(Brand);


exports.updateBrand =factoryHandlers.updateDocument(Brand);


exports.deleteBrand =factoryHandlers.deleteFactoey(Brand);

