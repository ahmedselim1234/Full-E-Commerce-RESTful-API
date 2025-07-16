require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dbnonnect");
const corsOptions = require("./config/corsOptions");
const multer = require("multer");
const path=require('path')
const app = express();
const port = process.env.PORT || 3000;
//-------------

// require routes
const authRoutes = require("./routes/authRoutes");

//middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routs
app.use("/auth", authRoutes); 

  
//----------
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log("cannot connect to db", err);
  });
