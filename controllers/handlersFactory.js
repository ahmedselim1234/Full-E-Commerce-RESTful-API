const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../middleware/errorHandler");
const { ApiFeatures } = require("../util/apiFeatures");

exports.deleteFactoey = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const model = await Model.findByIdAndDelete(id);
    if (!model) {
      return next(new ApiError("this product is not exist", 404));
    }
    res.status(204).json({ m: "deleted" });
  });

exports.updateDocument = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    } else if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }

    const model = await Model.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!model) {
      return next(new ApiError("this document is not exist", 404));
    }
    res.status(200).json({ data: model });
  });

exports.createDocument = (Model) =>
  asyncHandler(async (req, res, next) => {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    } else if (req.body.name) {
      req.body.slug = slugify(req.body.name);
      console.log(req.body.name)
    }
    const newModel = await Model.create(req.body);

    res.status(201).json({ newModel });
  });

exports.getSpeceficDocument = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const model = await Model.findById(id);
    if (!model) {
      return next(new ApiError("this product is not exist", 404));
    }
    res.status(200).json({ data: model });
  });

exports.getALLDocument = (Model,ModelName) => asyncHandler(async (req, res, next) => {
  const CountOfDocuments = await Model.countDocuments();

  const apiFeatures = new ApiFeatures(Model.find(), req.query)
    .filter()
    .search(ModelName)
    .sort()
    .limitFields()
    .paginate(CountOfDocuments);

  const { mongoQuery, paginatetionResult } = apiFeatures;

  const Documents  = await mongoQuery;

  res
    .status(200)
    .json({
      result: Documents .length,
      paginatetionResult: paginatetionResult,
      data: Documents ,
    });
});

