
const factoryHandlers=require('./handlersFactory')

const Coupon = require("../models/couponModel");

exports.createCoupon = factoryHandlers.createDocument(Coupon);

exports.getCoupons=factoryHandlers.getALLDocument(Coupon);

exports.getSpeceficCoupon=factoryHandlers.getSpeceficDocument(Coupon);


exports.updateCoupon =factoryHandlers.updateDocument(Coupon);


exports.deleteCoupon =factoryHandlers.deleteFactoey(Coupon);

