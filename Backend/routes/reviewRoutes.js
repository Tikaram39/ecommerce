// routes/reviewRoutes.js

import express from "express";

const router = express.Router();

// Get reviews for a product
router.get("/:productId", async (req, res) => {
  res.json({
    success: true,
    productId: req.params.productId,
    reviews: [],
  });
});

// Add review
router.post("/", async (req, res) => {
  const { productId, rating, comment } = req.body;

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    review: {
      productId,
      rating,
      comment,
    },
  });
});

// Update review
router.put("/:reviewId", async (req, res) => {
  res.json({
    success: true,
    message: "Review updated successfully",
  });
});

// Delete review
router.delete("/:reviewId", async (req, res) => {
  res.json({
    success: true,
    message: "Review deleted successfully",
  });
});

export default router;