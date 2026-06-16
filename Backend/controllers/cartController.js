import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price discountPrice images stock brand category"
    );
    res.json(new ApiResponse(200, { cart }, "Cart fetched"));
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");
    if (product.stock < quantity) throw new ApiError(400, "Insufficient stock");

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock);
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.discountPrice || product.price,
      });
    }

    await cart.save();
    await cart.populate("items.product", "name price discountPrice images stock");

    res.json(new ApiResponse(200, { cart }, "Item added to cart"));
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new ApiError(404, "Cart not found");

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) throw new ApiError(404, "Item not found in cart");

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json(new ApiResponse(200, { cart }, "Cart updated"));
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new ApiError(404, "Cart not found");

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();
    res.json(new ApiResponse(200, { cart }, "Item removed from cart"));
  } catch (error) {
    next(error);
  }
};

export const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: Date.now() },
    });

    if (!coupon) throw new ApiError(400, "Invalid or expired coupon");
    if (coupon.usedBy.includes(req.user._id))
      throw new ApiError(400, "Coupon already used");

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    const subtotal = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity, 0
    );

    if (subtotal < coupon.minOrderAmount)
      throw new ApiError(
        400, `Minimum order amount Rs. ${coupon.minOrderAmount} required`
      );

    let discount =
      coupon.discountType === "percentage"
        ? (subtotal * coupon.discountValue) / 100
        : coupon.discountValue;

    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);

    cart.couponCode = coupon.code;
    cart.discountAmount = discount;
    await cart.save();

    res.json(
      new ApiResponse(200, { discount, couponCode: coupon.code }, "Coupon applied")
    );
  } catch (error) {
    next(error);
  }
};
