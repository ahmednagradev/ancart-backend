import { Request, Response } from "express";
import orderModel from "../../../models/order.model";

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const allowedStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status",
            });
        }

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            message: `Order status updated to ${status}`,
        });

    } catch (error) {
        console.error("Update order status (admin) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}