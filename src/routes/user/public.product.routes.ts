import { Router } from "express";
import { listPublicProducts } from "../../controllers/user/product/listPublicProducts.controller";
import { getProductById } from "../../controllers/user/product/getProductById.controller";
import { getProductsByCategory } from "../../controllers/user/product/getProductsByCategory.controller";

const router = Router();

router.get("/get-public-products", listPublicProducts); // done
router.get("/get-product-by-id/:productId", getProductById); // done
router.get("/get-products-by-category/:categoryId", getProductsByCategory); // done

export default router;