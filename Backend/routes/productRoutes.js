import express from "express";
import {
  getProducts, getProductById, createProduct,
  updateProduct, deleteProduct, getFeaturedProducts,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { uploadMultiple } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);

router.post("/", protect, adminOnly, uploadMultiple, createProduct);
router.put("/:id", protect, adminOnly, uploadMultiple, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
