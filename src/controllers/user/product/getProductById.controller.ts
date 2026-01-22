import { Request, Response } from "express";
import productModel from "../../../models/product.model";

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        const product = await productModel.findById(productId)

        if (!product || !product.isActive) {
            return res.status(404).json({
                message: "Product not found or inactive",
            })
        }

        return res.status(200).json({
            success: true,
            product,
        });

    } catch (error) {
        console.error("Get product (public) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}