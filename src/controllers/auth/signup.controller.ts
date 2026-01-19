import { Request, Response } from "express";
import userModel from "../../models/user.model";
import bcrypt from "bcryptjs";
import { generateVerificationCode } from "../../utils/generateVerification";
import { sendVerificationEmail } from "../../services/email.service";

export const signupController = async (req: Request, res: Response) => {
    try {
        const { fullname, email, password } = req.body;

        // 1. Basic presence check
        if (!fullname.trim() || !email.trim() || !password.trim()) {
            return res.status(400).json({
                message: "Invalid signup data"
            })
        }

        // 2. Normalize email
        const normalizedEmail = email.toLowerCase();

        // 3. Check existing user
        const existingUser = await userModel.findOne({ email: normalizedEmail });

        // 4. If verified user exists, block signup
        if (existingUser && existingUser.status === "ACTIVE") {
            return res.status(400).json({
                message: "Account already exists. Please sign in."
            })
        }

        // 5. Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds)

        // 6. Generate verification data
        const { code, expiry } = generateVerificationCode();

        let user;

        // 7. If unverified user exists, update
        if (existingUser) {
            existingUser.fullname = fullname;
            existingUser.passwordHash = passwordHash;
            existingUser.verificationCode = code;
            existingUser.verificationCodeExpiresAt = expiry;

            user = await existingUser.save();
        }

        // 8. Else, create new user
        else {
            user = await userModel.create({
                fullname,
                email: normalizedEmail,
                passwordHash,
                verificationCode: code,
                verificationCodeExpiresAt: expiry,
            })
        }

        // 9. Send verification email
        sendVerificationEmail(user.email, user.verificationCode)
            .catch(error => console.error("Sending verification email failed:", error));

        // 10. Safe response
        return res.status(201).json({
            message: "Signup successful. Please verify your email.",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                status: user.status,
            },
        })

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}