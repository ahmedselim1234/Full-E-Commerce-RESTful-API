const express = require("express");
const orderController = require("../controllers/order");
const requireAuth = require("../middleware/isAuth");
const roles = require("../middleware/role");

const router = express.Router();

// Routes accessible by "client"
router.post("/:cartId", requireAuth, roles.allowedTo("client"), orderController.createCashOrder);
router.get("/getMyOrders", requireAuth, roles.allowedTo("client"), orderController.getOrderForLoggedUser);

// Routes accessible by "admin" or "manager"
router.use(requireAuth, roles.allowedTo("admin", "manager")); 

router.get("/", orderController.getAllOrders);
router.get("/:orderId", orderController.getSpeceficOrder);
router.put("/:orderId/pay", orderController.updateOrderToPay);
router.put("/:orderId/delivered", orderController.updateOrderToDelivered);

module.exports = router;
