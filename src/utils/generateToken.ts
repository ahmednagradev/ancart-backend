import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: { userId: string; role: "USER" | "ADMIN"; }) => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "15m" });
};