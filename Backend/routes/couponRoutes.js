// routes/couponRoutes.js

import express from "express";

const router = express.Router();

// Get all coupons
router.get("/", async (req, res) => {
  res.json({
    success: true,
    coupons: [],
  });
});

// Create coupon
router.post("/", async (req, res) => {
  const { code, discount } = req.body;

  res.status(201).json({
    success: true,
    message: "Coupon created",
    coupon: {
      code,
      discount,
    },
  });
});

// Validate coupon
router.post("/validate", async (req, res) => {
  const { code } = req.body;

  res.json({
    success: true,
    message: "Coupon is valid",
    code,
  });
});

// Delete coupon
router.delete("/:id", async (req, res) => {
  res.json({
    success: true,
    message: "Coupon deleted",
  });
});

export default router;