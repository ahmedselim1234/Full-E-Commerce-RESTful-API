require("dotenv").config();
const cors = require("cors");
// eslint-disable-next-line import/no-extraneous-dependencies
const compression = require('compression')
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const morgan = require("morgan");
const connectDB = require("./config/dbnonnect");
// const corsOptions = require("./config/corsOptions");
const { ApiError, HandleError } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
//compress all requests
app.use(compression()); 


const port = process.env.PORT || 3000;
//-------------

// require routes
const mountRoures = require("./routes/index");

//middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "uploads")));

// routs
mountRoures(app);

app.use((req, res, next) => {
  next(new ApiError("this page is not exist", 404));
});

//Handle errors that cuase from express
app.use(HandleError);

//----------

//Handle errors that cuase not  from express
process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection", err.message);
  process.exit(1);
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log("server is running");
  });
});
