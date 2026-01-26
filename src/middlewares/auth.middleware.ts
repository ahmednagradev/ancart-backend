import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: string;
    role: "USER" | "ADMIN";
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.accessToken;

        // 1. Token presence check
        if (!token) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        // 3. Attach user info to request
        (req as any).user = {
            userId: decoded.userId,
            role: decoded.role,
        };

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

// Example protected route:
// app.get("/api/profile", authMiddleware, (req, res) => {
//    res.json({ message: "Protected route" })
// })


// Previous code:
// const authHeader = req.headers.authorization;
// if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({
//         message: "Authentication required"
//     });
// }
// const token = authHeader.split(" ")[1];