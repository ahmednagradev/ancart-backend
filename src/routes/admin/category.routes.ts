import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";
import { createCategory } from "../../controllers/admin/category/createCategory.controller";
import { updateCategory } from "../../controllers/admin/category/updateCategory.controller";
import { deactivateCategory } from "../../controllers/admin/category/deactivateCategory.controller";
import { listCategories } from "../../controllers/admin/category/listCategories.controller";

const router = Router();

router.use(authMiddleware);
router.use(authorizeRoles(["ADMIN"]));

router.get("/get-all-categories", listCategories); // // done
router.post("/create-category", createCategory); // // done
router.patch("/update-category/:categoryId", updateCategory); // // done
router.patch("/deactivate-category/:categoryId", deactivateCategory); // // done

export default router;