import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createOrder } from "../../controllers/user/order/createOrder.controller";
import { getUserOrders } from "../../controllers/user/order/getUserOrders.controller";
import { createOrderFromCart } from "../../controllers/user/order/createOrderFromCart.controller";
import { cancelOrder } from "../../controllers/user/order/cancelOrder.controller";
const router = Router();

router.use(authMiddleware);

router.post("/create-order", createOrder);
router.get("/get-user-orders", getUserOrders);
router.post("/create-order-from-cart", createOrderFromCart);
router.patch("/cancel-order/:orderId", cancelOrder);

export default router;
