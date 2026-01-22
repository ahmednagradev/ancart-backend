import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import orderModel from "../../../models/order.model";
import productModel from "../../../models/product.model";

export const adminCancelOrder = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const adminId = req.user!.id; // role already verified via middleware
        const { orderId } = req.params;
        const { reason, restoreStock } = req.body;

        if (!reason) {
            throw new Error("Cancellation reason is required");
        }

        const order = await orderModel
            .findById(orderId)
            .session(session);

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.status === "CANCELLED") {
            throw new Error("Order already cancelled");
        }

        if (order.status === "DELIVERED") {
            throw new Error("Delivered orders cannot be cancelled");
        }

        // Restore stock only if admin explicitly allows it
        if (restoreStock === true) {
            for (const item of order.items) {
                await productModel.updateOne(
                    { _id: item.product },
                    { $inc: { stock: item.quantity } },
                    { session }
                );
            }
        }

        // Update order state + audit fields
        order.status = "CANCELLED";
        order.cancelledBy = new Types.ObjectId(adminId);
        order.cancelReason = reason;
        order.cancelledAt = new Date();

        await order.save({ session });

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: "Order cancelled by admin",
            data: order,
        });

    } catch (error) {
        await session.abortTransaction();

        console.error("Admin cancel order error:", error);

        res.status(400).json({
            message: error instanceof Error ? error.message : "Cancellation failed",
        });

    } finally {
        session.endSession();
    }
};
