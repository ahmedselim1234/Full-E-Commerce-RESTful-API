// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const factoryHandlers = require("./handlersFactory");
const { uploadOImages } = require("../middleware/uploadImage");


exports.uploadProductImages = uploadOImages("imageCover", "availableImages");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  // for imageCover
  if (req.files.imageCover) {
    const imageCoverfilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(1700, 970)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverfilename}`);
    //save in db
    req.body.imageCover = imageCoverfilename;
  }

  if (req.files.availableImages) {
    req.body.availableImages = [];
    await Promise.all(
      req.files.availableImages.map(async (image) => {
        const availableImagesfilename = `product-${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(image.buffer)
          .resize(2000, 1800)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${availableImagesfilename}`);
        //save in db
        req.body.availableImages.push(availableImagesfilename);
      })
    );
  }

  next();
});

exports.createProdact = factoryHandlers.createDocument(Product);

exports.getProducts = factoryHandlers.getALLDocument(Product, "Products");

exports.getSpeceficproduct = factoryHandlers.getSpeceficDocument(Product,"reviews");

exports.updateproduct = factoryHandlers.updateDocument(Product);

exports.deleteProduct = factoryHandlers.deleteFactoey(Product);
