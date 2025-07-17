require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dbnonnect");
const corsOptions = require("./config/corsOptions");
const multer = require("multer");
const path=require('path')
const morgan=require('morgan')
const app = express();
const port = process.env.PORT || 3000;
//-------------

// require routes
const authRoutes = require("./routes/authRoutes");
const categoryRoures=require('./routes/category');

//middleware
if(process.env.NODE_ENV==='development'){
  app.use(morgan('dev'));
}
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routs
app.use("/api/v1/auth", authRoutes); 
app.use('/api/v1/category',categoryRoures)
  
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
