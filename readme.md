# Node.js E-Commerce Backend

A robust **Node.js backend** for an e-commerce platform, built with **Express**, **MongoDB**, and **JWT authentication**.  
This project demonstrates modern backend architecture, secure role-based access, and complete e-commerce functionality.

---

## Features

### Authentication & Roles
- Secure **JWT-based authentication**
- **Signup** with email verification
- **Role-based access control** (`user`, `admin`)
- Well-structured middleware separation

### Categories & Products
- **Category CRUD** operations (admin-only)
- **Product CRUD** operations (admin-only)
- **Soft deletes** using `isActive` flag
- Slug generation, schema references, and validation
- Public product listing with safe user view

### Cart System
- **One cart per user**
- Add, remove, and clear items
- No direct stock manipulation
- Live product data via `populate`
- Authentication required

### Orders
- Create order directly from cart
- Atomic stock enforcement
- Order snapshot captures price and product details at purchase
- User order listing and cancellation with stock restoration
- Admin control over order status

### Admin Order Management
- List all orders
- View single order with user and items
- Securely update order status

---

## Tech Stack
- **Node.js** and **Express**
- **MongoDB** with **Mongoose**
- **JWT Authentication**
- Middleware for role-based access control
- Email verification using Nodemailer

---

## Installation

```bash
# Clone the repository
git clone https://github.com/ahmednagradev/ancart-backend.git
cd ancart-backend

# Install dependencies
npm install

# Create a .env file with your environment variables
# Example:
# DB_URI=your_mongo_connection_string
# JWT_SECRET=your_jwt_secret
# EMAIL_USER=your_email
# EMAIL_PASS=your_email_password

# Start development server
npm run dev
