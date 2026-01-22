import { Router } from "express";
import { listPublicCategories } from "../../controllers/user/category/listPublicCategories.controller";
import { getCategoryById } from "../../controllers/user/category/getCategoryById.controller";

const router = Router();

router.get("/get-public-categories", listPublicCategories); // done
router.get("/get-category-by-id/:categoryId", getCategoryById); // done

export default router;