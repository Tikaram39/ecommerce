// routes/paymentRoutes.js

import express from "express";

const router = express.Router();

// Create payment
router.post("/create", async (req, res) => {
  const { amount } = req.body;

  res.json({
    success: true,
    message: "Payment initiated",
    amount,
  });
});

// Verify payment
router.post("/verify", async (req, res) => {
  res.json({
    success: true,
    message: "Payment verified successfully",
  });
});

// Payment history
router.get("/history", async (req, res) => {
  res.json({
    success: true,
    payments: [],
  });
});

export default router;