import { Request, Response } from "express";
import productModel from "../../../models/product.model";

export const getProductsByCategory = async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.params;

        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Number(req.query.limit) || 10, 50);
        const skip = (page - 1) * limit;

        const products = await productModel.find({ category: categoryId, isActive: true, stock: { $gt: 0 } })
            .populate({ path: "category", match: { isActive: true }, select: "name slug" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const filteredProducts = products.filter(p => p.category !== null);

        return res.status(200).json({
            page,
            limit,
            products: filteredProducts,
        });

    } catch (error) {
        console.error("Get products by category (public) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}