import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ─── Create Order ────────────────────────────────────────────────────────────
export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, couponCode } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0)
      throw new ApiError(400, "Cart is empty");

    // Validate stock availability
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for ${item.product.name}`
        );
      }
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0]?.url,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const shippingPrice = itemsPrice > 1000 ? 0 : 100;
    const taxPrice = Math.round(itemsPrice * 0.13); // 13% VAT

    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && coupon.expiresAt > Date.now() && coupon.usedCount < coupon.usageLimit) {
        if (coupon.discountType === "percentage") {
          discountAmount = (itemsPrice * coupon.discountValue) / 100;
          if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        } else {
          discountAmount = coupon.discountValue;
        }
        appliedCoupon = coupon;
      }
    }

    const totalPrice = itemsPrice + shippingPrice + taxPrice - discountAmount;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      discountAmount,
      totalPrice,
      couponCode: couponCode?.toUpperCase(),
      statusHistory: [{ status: "Pending", note: "Order placed" }],
    });

    // Decrease stock
    await Promise.all(
      cart.items.map((item) =>
        Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity },
        })
      )
    );

    // Update coupon usage
    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      appliedCoupon.usedBy.push(req.user._id);
      await appliedCoupon.save();
    }

    // Clear cart
    await Cart.findOneAndDelete({ user: req.user._id });

    res
      .status(201)
      .json(new ApiResponse(201, { order }, "Order placed successfully"));
  } catch (error) {
    next(error);
  }
};

// ─── Get My Orders ───────────────────────────────────────────────────────────
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort("-createdAt")
      .populate("orderItems.product", "name images");

    res.json(new ApiResponse(200, { orders }, "Orders fetched"));
  } catch (error) {
    next(error);
  }
};

// ─── Update Order Status (Admin) ─────────────────────────────────────────────
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError(404, "Order not found");

    if (order.orderStatus === "Delivered")
      throw new ApiError(400, "Order already delivered");

    order.orderStatus = status;
    order.statusHistory.push({ status, note });

    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();

    res.json(new ApiResponse(200, { order }, "Order status updated"));
  } catch (error) {
    next(error);
  }
};

// ─── Admin Get All Orders ────────────────────────────────────────────────────
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { orderStatus: status } : {};

    const totalItems = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("user", "name email");

    res.json(
      new ApiResponse(
        200,
        { orders, totalItems, totalPages: Math.ceil(totalItems / limit) },
        "Orders fetched"
      )
    );
  } catch (error) {
    next(error);
  }
};
