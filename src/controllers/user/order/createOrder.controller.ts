import { Request, Response } from "express";
import mongoose from "mongoose";
import productModel from "../../../models/product.model";
import orderModel from "../../../models/order.model";

export const createOrder = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user!.id;
        const { deliveryAddress } = req.body;
        const { items } = req.body;

        // Delivery address validation
        if (!deliveryAddress) {
            throw new Error("Delivery address is required");
        }

        const { fullName, phone, addressLine, city } = deliveryAddress;

        if (!fullName?.trim() || !phone?.trim() || !addressLine?.trim() || !city?.trim()) {
            throw new Error("Invalid delivery address data")
        }

        // Items validation
        if (!items || !items.length) {
            throw new Error("Invalid order items data");
        }

        let totalAmount = 0;
        const orderItems: any[] = [];

        for (const item of items) {
            // Atomic stock check and increment
            const product = await productModel.findOneAndUpdate(
                { _id: item.productId, isActive: true, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true, session }
            );

            if (!product) {
                throw new Error("Invalid or out of stock product")
            }

            totalAmount += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            });
        }

        const order = await orderModel.create(
            [{
                user: userId,
                items: orderItems,
                deliveryAddress,
                totalAmount,
                status: "PENDING",
            }],
            { session }
        );

        await session.commitTransaction();

        return res.status(201).json({
            message: "Order placed successfully",
            data: order[0],
        });

    } catch (error) {
        await session.abortTransaction();

        console.error("Create order (user) error:", error);

        return res.status(400).json({
            message: error instanceof Error ? error.message : "Order failed",
        });

    } finally {
        session.endSession();
    }
}