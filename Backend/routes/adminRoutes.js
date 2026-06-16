// routes/adminRoutes.js

import express from "express";

const router = express.Router();

// Dashboard
router.get("/dashboard", async (req, res) => {
  res.json({
    success: true,
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
});

// Get all users
router.get("/users", async (req, res) => {
  res.json({
    success: true,
    users: [],
  });
});

// Get all orders
router.get("/orders", async (req, res) => {
  res.json({
    success: true,
    orders: [],
  });
});

// Get all products
router.get("/products", async (req, res) => {
  res.json({
    success: true,
    products: [],
  });
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  res.json({
    success: true,
    message: "User deleted successfully",
  });
});

export default router;