require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
// const multer = require("multer");
// const path = require("path");
const morgan = require("morgan");
const connectDB = require("./config/dbnonnect");
const corsOptions = require("./config/corsOptions");
const {ApiError,HandleError} = require("./middleware/errorHandler");
//ApiError is a class to create error
const app = express();
const port = process.env.PORT || 3000;
//-------------

// require routes
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/category");
const subCategoryRoutes = require("./routes/subCategory");
const brandsRoutes = require("./routes/brandsRoutes");


//middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routs
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subcategories", subCategoryRoutes);
app.use("/api/v1/brands", brandsRoutes);

app.use((req, res, next) => {
   next(new ApiError("this page is not exist", 404));
});

//Handle errors that cuase from express
app.use(HandleError);

//----------
 
 

//Handle errors that cuase not  from express
process.on('unhandledRejection',(err)=>{
   console.log("unhandledRejection",err.message);
   process.exit(1);
}) 

connectDB() 
  .then(() => {
    app.listen(port, () => {
      console.log("server is running");
    });
  });

