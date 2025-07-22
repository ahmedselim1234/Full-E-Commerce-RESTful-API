const multer = require("multer");
const Category = require("../models/category");
const factoryHandlers = require("./handlersFactory");
const { v4: uuidv4 } = require("uuid");
const { ApiError } = require("../middleware/errorHandler");

//Disk storage
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/category");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});
// just images allowed
const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("only images", 400));
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadCategoryImage = upload.single("image");

exports.createCategory = factoryHandlers.createDocument(Category);

exports.getCategories = factoryHandlers.getALLDocument(Category);

exports.getSpeceficCategory = factoryHandlers.getSpeceficDocument(Category);

exports.updateCategory = factoryHandlers.updateDocument(Category);

exports.deleteCategory = factoryHandlers.deleteFactoey(Category);
