import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth/auth.routes";
import adminProductRoutes from "./routes/admin/product.routes";
import adminCategoryRoutes from "./routes/admin/category.routes";
import adminOrderRoutes from "./routes/admin/order.routes";
import userProductRoutes from "./routes/user/public.product.routes";
import userCategoryRoutes from "./routes/user/public.category.routes";
import userOrderRoutes from "./routes/user/user.order.routes";
import userCartRoutes from "./routes/user/user.cart.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Auth routes
app.use("/api/auth", authRoutes);

// Admin (protected) routes
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// Public routes
app.use("/api/user/categories", userCategoryRoutes);
app.use("/api/user/products", userProductRoutes);

// Authenticated user order routes
app.use("/api/cart", userCartRoutes);
app.use("/api/orders", userOrderRoutes);


export default app;