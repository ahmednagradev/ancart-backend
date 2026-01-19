import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (allowedRoles: Array<"USER" | "ADMIN">) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        next();
    }
}

// Usage example
// app.post(
//   "/api/admin/product",
//   authMiddleware,
//   authorizeRoles(["admin"]),
//   createProduct
// );