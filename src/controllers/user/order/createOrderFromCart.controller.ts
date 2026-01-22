import { Request, Response } from "express";
import mongoose from "mongoose";
import cartModel from "../../../models/cart.model";
import productModel from "../../../models/product.model";
import orderModel from "../../../models/order.model";

export const createOrderFromCart = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user!.id;
        const { deliveryAddress } = req.body;

        // Delivery address validation
        if (!deliveryAddress) {
            throw new Error("Delivery address is required");
        }

        const { fullName, phone, addressLine, city } = deliveryAddress;

        if (!fullName?.trim() || !phone?.trim() || !addressLine?.trim() || !city?.trim()) {
            throw new Error("Invalid delivery address data")
        }

        // Get user cart
        const cart = await cartModel
            .findOne({ user: userId })
            .populate("items.product", "name price stock isActive")
            .session(session);

        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        // Validate items and prepare order snapshot
        let totalAmount = 0;
        const orderItems: any[] = [];

        for (const item of cart.items) {
            // Items validation
            if (!item.product || item.quantity <= 0) {
                throw new Error("Invalid cart item data")
            }

            const product = item.product as any;

            if (!product.isActive || product.stock < item.quantity) {
                throw new Error(`${product.name} is unavailable or out of stock`)
            }

            totalAmount += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            });
        }

        // Deduct stock atomically
        for (const item of cart.items) {
            const product = item.product as any;

            await productModel.updateOne(
                { _id: product._id, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { session }
            );
        }

        // Create order
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

        // Clear cart
        cart.items = [];
        await cart.save({ session });

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order[0],
        });

    } catch (error) {
        await session.abortTransaction();

        console.error("Create order from cart (user) error:", error);

        return res.status(400).json({
            message: error instanceof Error ? error.message : "Order failed",
        });

    } finally {
        session.endSession();
    }
}