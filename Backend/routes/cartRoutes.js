// routes/cartRoutes.js

import express from "express";

const router = express.Router();

// Get Cart
router.get("/", async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      cart: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Add Item to Cart
router.post("/add", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      item: {
        productId,
        quantity,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update Cart Item Quantity
router.put("/update/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      item: {
        productId,
        quantity,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Remove Item from Cart
router.delete("/remove/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      productId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Clear Cart
router.delete("/clear", async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;