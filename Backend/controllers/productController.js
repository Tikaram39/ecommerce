import product from "../models/product.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import cloudinary from "../config/cloudinary.js";
import { getPagination } from "../utils/pagination.js";

// ─── Get All Products (with filters, search, pagination) ─────────────────────
export const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      page = 1,
      limit = 12,
      sort = "-createdAt",
    } = req.query;

    const query = {};

    if (keyword) {
      query.$text = { $search: keyword };
    }
    if (category) query.category = category;
    if (brand) query.brand = { $in: brand.split(",") };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) query.ratings = { $gte: Number(rating) };

    const { skip, limit: lim, totalPages, totalItems } =
      await getPagination(Product, query, page, limit);

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(lim)
      .select("-reviews");

    res.json(
      new ApiResponse(
        200,
        { products, totalPages, totalItems, currentPage: Number(page) },
        "Products fetched"
      )
    );
  } catch (error) {
    next(error);
  }
};

// ─── Get Single Product ──────────────────────────────────────────────────────
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: "reviews",
      populate: { path: "user", select: "name avatar" },
    });

    if (!product) throw new ApiError(404, "Product not found");

    // Related products by category
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(8)
      .select("name price images ratings numReviews");

    res.json(new ApiResponse(200, { product, related }, "Product fetched"));
  } catch (error) {
    next(error);
  }
};

// ─── Create Product (Admin) ──────────────────────────────────────────────────
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, discountPrice, category, brand,
            stock, isFeatured, isTrending, tags, specifications } = req.body;

    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "ecommerce/products",
          transformation: [{ width: 800, height: 800, crop: "limit" }],
        })
      );
      const results = await Promise.all(uploadPromises);
      images = results.map((r) => ({ public_id: r.public_id, url: r.secure_url }));
    }

    const product = await Product.create({
      name, description, price, discountPrice, category,
      brand, stock, isFeatured, isTrending, images,
      tags: tags ? JSON.parse(tags) : [],
      specifications: specifications ? JSON.parse(specifications) : [],
      seller: req.user._id,
    });

    res
      .status(201)
      .json(new ApiResponse(201, { product }, "Product created successfully"));
  } catch (error) {
    next(error);
  }
};

// ─── Update Product (Admin) ──────────────────────────────────────────────────
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, "Product not found");

    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      await Promise.all(
        product.images.map((img) => cloudinary.uploader.destroy(img.public_id))
      );

      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "ecommerce/products",
        })
      );
      const results = await Promise.all(uploadPromises);
      req.body.images = results.map((r) => ({
        public_id: r.public_id,
        url: r.secure_url,
      }));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(new ApiResponse(200, { product }, "Product updated successfully"));
  } catch (error) {
    next(error);
  }
};

// ─── Delete Product (Admin) ──────────────────────────────────────────────────
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, "Product not found");

    await Promise.all(
      product.images.map((img) => cloudinary.uploader.destroy(img.public_id))
    );

    await product.deleteOne();
    res.json(new ApiResponse(200, null, "Product deleted successfully"));
  } catch (error) {
    next(error);
  }
};

// ─── Get Featured Products ───────────────────────────────────────────────────
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .limit(8)
      .select("name price discountPrice images ratings numReviews category");
    res.json(new ApiResponse(200, { products }, "Featured products fetched"));
  } catch (error) {
    next(error);
  }
};
