import { Request, Response } from "express";
import userModel from "../../models/user.model";
import { generateVerificationCode } from "../../utils/generateVerification";
import { sendVerificationEmail } from "../../services/email.service";

export const resendVerification = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        // 1. Presence check
        if (!email) {
            return res.status(400).json({
                message: "Invalid resend verification data"
            })
        }

        const normalizedEmail = email.toLowerCase();

        // 2. Find user
        const user = await userModel.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // 3. Already verified?
        if (user?.status === "ACTIVE") {
            return res.status(400).json({
                message: "Account already verified",
            });
        }

        // 4. Generate new code
        const { code, expiry } = generateVerificationCode();

        user.verificationCode = code;
        user.verificationCodeExpiresAt = expiry;

        await user.save();

        // 5. Send verification email
        sendVerificationEmail(user.email, user.verificationCode)
            .catch(error => console.error("Sending verification email failed:", error));

        return res.status(200).json({
            message: "Verification code sent. Check your email."
        })

    } catch (error) {
        console.error("Resend verification error:", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}