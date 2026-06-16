import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, totalOrders, revenueData] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          { $match: { isPaid: true } },
          { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
        ]),
      ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Monthly sales for chart (last 12 months)
    const monthlySales = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: {
            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          sales: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    // Low stock products
    const lowStockProducts = await Product.find({ stock: { $lte: 10 } })
      .select("name stock category images")
      .limit(10);

    // Recent orders
    const recentOrders = await Order.find()
      .sort("-createdAt")
      .limit(10)
      .populate("user", "name email");

    res.json(
      new ApiResponse(
        200,
        {
          stats: { totalUsers, totalProducts, totalOrders, totalRevenue },
          monthlySales,
          orderStatusBreakdown,
          lowStockProducts,
          recentOrders,
        },
        "Dashboard stats fetched"
      )
    );
  } catch (error) {
    next(error);
  }
};
