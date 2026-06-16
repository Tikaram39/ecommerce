import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export const protect = async (req, res, next) => {
  try {
    let token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Not authorized, please login");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) throw new ApiError(401, "User not found");
    if (user.isBlocked) throw new ApiError(403, "Account has been blocked");

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, "Authentication failed"));
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(new ApiError(403, "Admin access required"));
  }
  next();
};
