import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";
import { createProduct } from "../../controllers/admin/createProduct.controller";

const router = Router();

router.use(authMiddleware);
router.use(authorizeRoles(["ADMIN"]));

router.post("/", createProduct);

router.put("/:id", (req, res) => {
    res.json({ message: "Update product (admin only" });
});

router.delete("/:id", (req, res) => {
    res.json({ message: "Delete product (admin only)" });
});

export default router;