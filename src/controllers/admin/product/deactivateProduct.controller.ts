import { Request, Response } from "express";
import productModel from "../../../models/product.model";

export const deactivateProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        product.isActive = false;
        await product.save();

        return res.status(200).json({
            message: "Product deactivated",
        });
        
    } catch (error) {
        console.error("Deactivate product (admin) error", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}