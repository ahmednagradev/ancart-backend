import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";
import { getAllOrders } from "../../controllers/admin/order/getAllOrders.controller";
import { getOrderById } from "../../controllers/admin/order/getOrderById.controller";
import { updateOrderStatus } from "../../controllers/admin/order/updateOrderStatus.controller";
import { adminCancelOrder } from "../../controllers/admin/order/adminCancelOrder.controller";

const router = Router();

router.use(authMiddleware);
router.use(authorizeRoles(["ADMIN"]));

router.get("/get-all-orders", getAllOrders);
router.get("/get-order-by-id/:orderId", getOrderById);
router.patch("/update-order-status/:orderId", updateOrderStatus);
router.patch("/cancel-order/:orderId", adminCancelOrder);

export default router;