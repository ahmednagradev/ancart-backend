import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { addToCart } from "../../controllers/user/cart/addToCart.controller";
import { getCart } from "../../controllers/user/cart/getCart.controller";
import { clearCart } from "../../controllers/user/cart/clearCart.controller";
import { removeFromCart } from "../../controllers/user/cart/removeFromCart.controller";

const router = Router();

router.use(authMiddleware);

router.get("/get-cart", getCart);
router.post("/add-to-cart", addToCart);
router.delete("/remove-from-cart/:productId", removeFromCart);
router.post("/clear-cart", clearCart);

export default router;