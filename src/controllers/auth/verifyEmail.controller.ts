import { Request, Response } from "express";
import userModel from "../../models/user.model";

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;

        // 1. Presence check
        if (!email || !code) {
            return res.status(400).json({
                message: "Invalid verification data"
            });
        }

        const normalizedEmail = email.toLowerCase();

        // 2. Find user
        const user = await userModel.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // 3. Already verified?
        if (user?.status === "ACTIVE") {
            return res.status(400).json({
                message: "Account already verified"
            })
        }

        // 4. Code match
        if (user?.verificationCode !== code) {
            return res.status(400).json({
                message: "Invalid verification code"
            })
        }

        // 5. Expiry check
        if (!user?.verificationCodeExpiresAt || user.verificationCodeExpiresAt.getTime() < Date.now()) {
            return res.status(400).json({
                message: "Verification code expired"
            })
        }

        // 6. Activate user
        user.status = "ACTIVE";
        user.verificationCode = undefined;
        user.verificationCodeExpiresAt = undefined;

        await user.save();

        return res.status(201).json({
            message: "Account verified successfully"
        })

    } catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}