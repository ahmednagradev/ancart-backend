import { Request, Response } from "express";
import productModel from "../../../models/product.model";
import slugify from "slugify";
import { Types } from "mongoose";
import categoryModel from "../../../models/category.model";

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { name, description, price, stock, categoryId, isActive } = req.body;

        // 1. Find product
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 2. Set name and slug
        if (typeof name === "string" && name.trim()) {
            const newSlug = slugify(name, { lower: true });

            const existingSlug = await productModel.findOne({
                slug: newSlug,
                _id: { $ne: new Types.ObjectId(productId as string) }
            });

            if (existingSlug) {
                return res.status(409).json({
                    message: "Category name already in use",
                });
            }

            product.name = name;
            product.slug = newSlug;
        }

        // 3. Set description
        if (typeof description === "string" && description.trim()) {
            product.description = description;
        }

        // 4. Set price
        if (typeof price === "number") {
            if (price < 0) {
                return res.status(400).json({ message: "Invalid price" });
            }
            product.price = price;
        }

        // 5. Update stock
        if (typeof stock === "number") {
            if (stock < 0) {
                return res.status(400).json({ message: "Invalid stock value" });
            }
            product.stock = stock;
        }

        // 6. Update category
        if (categoryId) {
            const category = await categoryModel.findOne({ _id: categoryId, isActive: true });
            if (!category) {
                return res
                    .status(404)
                    .json({ message: "Category not found or inactive" });
            }
            product.category = category._id;
        }

        // 7. Set isActive
        if (typeof isActive === "boolean") {
            product.isActive = !isActive;
        }

        // 8. Save
        await product.save();

        // 9. Response
        return res.status(200).json({
            message: "Product updated successfully",
            product,
        });

    } catch (error) {
        console.error("Update product (admin) error", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}