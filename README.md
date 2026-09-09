# 🛒 QuickCart – Online Grocery Delivery Platform

QuickCart is an online grocery delivery platform developed using **Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, React and Vite**.

The platform allows customers to browse grocery products, place orders, select delivery time slots and track their orders. It also provides dark-store management, store-wise inventory management, order picking and packing, delivery partner assignment, stock replenishment alerts, performance reports and role-based access control.

---

## 📌 Project Overview

The main objective of this project is to develop a backend-driven online grocery delivery system that manages the complete order lifecycle from product selection to delivery.

The system follows an MVC-style backend architecture and uses MongoDB for data storage.

### Main User Roles

- **Customer** – Browse products, place orders, view order history and reorder products.
- **Store Staff** – Manage store inventory and handle picking and packing.
- **Delivery Partner** – Handle assigned deliveries and update delivery status.
- **Admin** – Manage stores, products, delivery partners and performance reports.

---

## 🚀 Features

- User registration and authentication
- JWT-based authentication
- Password hashing using bcrypt
- Role-Based Access Control (RBAC)
- Dark-store management
- Product catalog management
- Store-wise inventory management
- Nearest-store serviceability check
- Automatic stock reduction during order placement
- Order picking and packing workflow
- Delivery partner assignment
- Delivery status tracking
- Real-time order status retrieval
- Stock replenishment alerts
- Delivery time slot selection
- Customer order history
- Order reorder functionality
- Store performance reports
- Delivery partner performance reports
- Server-side validation
- Centralized error handling
- MongoDB transactions for important operations

---

# 📦 Project Modules

The project implements the following 13 modules:

### 1. User Registration & Authentication
Customers can register and login securely using email and password.

Passwords are hashed using bcrypt and authenticated users receive a JWT token.

### 2. Dark-Store Management
Admins can create and manage dark stores used for fulfilling customer orders.

### 3. Product Catalog & Store-Wise Stock
The system maintains a central product catalog and manages stock separately for each dark store.

### 4. Order Placement with Nearest-Store Check
Customers can place orders only when a suitable active store has the required products and sufficient stock.

### 5. Order Picking & Packing Workflow
Store staff process orders through:

`PLACED → PICKING → PACKED`

### 6. Delivery Partner Assignment
Available delivery partners can be assigned to packed orders.

### 7. Delivery Status Tracking
Delivery partners update orders through:

`ASSIGNED → OUT_FOR_DELIVERY → DELIVERED`

### 8. Real-Time Order Status for Customer
Customers can retrieve the latest status of their own orders.

### 9. Stock Replenishment Alerts
The system identifies products whose stock reaches or falls below their reorder point.

### 10. Delivery Time Slot Selection
Customers select an available delivery time slot while placing an order.

Available slots include:

- 09:00–11:00
- 11:00–13:00
- 13:00–15:00
- 15:00–17:00
- 17:00–19:00
- 19:00–21:00

### 11. Customer Order History & Reorder
Customers can view their previous orders and create a new order using products from an earlier order.

### 12. Store & Delivery Performance Reports
Admins can view overall order performance, store performance and delivery partner performance.

### 13. Role-Based Access Control
Access to APIs is controlled based on user roles and resource ownership.

---

# 🛠️ Technologies Used

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- express-validator
- dotenv

## Frontend

- React
- Vite
- JavaScript
- Vanilla CSS
- React Router

## Testing

- Postman
- MongoDB Atlas

---

# 📁 Project Structure

```text
Online-Grocery-Delivery-Platform/
│
├── config/
│   └── db.js
│
├── controllers/
│
├── middleware/
│
├── models/
│
├── routes/
│
├── utils/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── postman/
│
├── docs/
│
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
