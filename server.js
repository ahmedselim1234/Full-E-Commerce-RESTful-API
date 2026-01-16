require("dotenv").config();
const cors = require("cors");
// eslint-disable-next-line import/no-extraneous-dependencies
const compression = require("compression");
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const morgan = require("morgan");
const connectDB = require("./config/dbnonnect");
// const corsOptions = require("./config/corsOptions");
const { ApiError, HandleError } = require("./middleware/errorHandler");
const { webhookCheckout } = require("./controllers/order");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss");

//stripe listen --forward-to localhost:3000/checkout-webhook

const app = express();

// app.use(cors());
// مثال Express.js
import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",
  "https://react-e-commerce-ivory.vercel.app"
]; 

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


//compress all requests
app.use(compression());

//checkout webhook

app.post(
  "/checkout-webhook",
  express.raw({ type: "application/json" }),
  webhookCheckout,
);

const port = process.env.PORT || 3000;
//-------------

// require routes
const mountRoures = require("./routes/index");

//middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "uploads")));

// app.use(mongoSanitize());
// app.use(xss());
//Express middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp({ whitelist: ["price"] }));

//rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: "to many requests from this ip",
});

// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);

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
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
});
