import { Request, Response } from "express";
import mongoose from "mongoose";
import orderModel from "../../../models/order.model";
import productModel from "../../../models/product.model";

export const cancelOrder = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user!.id;
        const { orderId } = req.params;

        const order = await orderModel
            .findOne({ _id: orderId, user: userId })
            .session(session);

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.status === "CANCELLED") {
            throw new Error("Order is already cancelled");
        }

        // Cancellation rules:
        // COD    -> PENDING, CONFIRMED
        // Online -> PENDING only
        const allowedStatuses: string[] =
            order.orderData.paymentMethod === "COD"
                ? ["PENDING", "CONFIRMED"]
                : ["PENDING"];

        if (!allowedStatuses.includes(order.status)) {
            throw new Error("Cannot cancel this order");
        }

        // Restore stock
        for (const item of order.items) {
            await productModel.updateOne(
                { _id: item.product },
                { $inc: { stock: item.quantity } },
                { session }
            );
        }

        order.status = "CANCELLED";
        await order.save({ session });

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order,
        });
    } catch (error) {
        await session.abortTransaction();

        console.error("Cancel order (user) error:", error);

        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Order cancellation failed",
        });
    } finally {
        session.endSession();
    }
};