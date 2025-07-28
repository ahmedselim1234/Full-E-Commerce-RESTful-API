const authRoutes = require("./authRoutes");
const categoryRoutes = require("./category");
const subCategoryRoutes = require("./subCategory");
const brandsRoutes = require("./brandsRoutes");
const productRoutes = require("./productRoutes");
const usersRoutes = require("./user");
const reviewRoutes = require("./review");
const wishListRoutes = require("./wishList");
const addressRoutes = require("./addresses");
const couponRoutes = require("./coupon");
const cartRoutes = require("./cartRoute");
const orderRoutes = require("./order");

const mountRouts=(app)=>{
    app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subcategories", subCategoryRoutes);
app.use("/api/v1/brands", brandsRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/wishList", wishListRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/coupon", couponRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/order", orderRoutes);
}

module.exports=mountRouts;