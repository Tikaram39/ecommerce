// ============================================================
//  server.js — Main Application Entry Point
//  Stack : Node.js + Express + MongoDB (ESM)
// ============================================================

// ─── MUST BE FIRST: Load env vars before anything else ───────
import dotenv from "dotenv";
dotenv.config();

import express        from "express";
import cors           from "cors";
import helmet         from "helmet";
import cookieParser   from "cookie-parser";
import mongoSanitize  from "express-mongo-sanitize";

import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { generalLimiter }         from "./middleware/rateLimiter.js";

// ─── Route Imports ────────────────────────────────────────────
import authRoutes    from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes   from "./routes/orderRoutes.js";
import cartRoutes    from "./routes/cartRoutes.js";
import userRoutes    from "./routes/userRoutes.js";
import reviewRoutes  from "./routes/reviewRoutes.js";
import couponRoutes  from "./routes/couponRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes   from "./routes/adminRoutes.js";

// ─── Environment Variables ────────────────────────────────────
const PORT       = process.env.PORT       || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const NODE_ENV   = process.env.NODE_ENV   || "development";

// ─── Express App Init ─────────────────────────────────────────
const app = express();

// ─── Security Middleware ──────────────────────────────────────
app.use(helmet());          // Secure HTTP headers
app.use(mongoSanitize());   // Prevent NoSQL injection
app.use(generalLimiter);    // Rate limiting

// ─── Core Middleware ──────────────────────────────────────────
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Dev Request Logger ───────────────────────────────────────
if (NODE_ENV === "development") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}]  ${req.method}  ${req.originalUrl}`);
    next();
  });
}

// ─── Health Check (place BEFORE api routes) ───────────────────
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    status:    "OK",
    message:   "Server is running",
    env:       NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────
app.use("/api/v1/auth",     authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders",   orderRoutes);
app.use("/api/v1/cart",     cartRoutes);
app.use("/api/v1/users",    userRoutes);
app.use("/api/v1/reviews",  reviewRoutes);
app.use("/api/v1/coupons",  couponRoutes);
app.use("/api/v1/payment",  paymentRoutes);
app.use("/api/v1/admin",    adminRoutes);

// ─── 404 + Global Error Handlers ─────────────────────────────
app.use(notFound);      // Must come after all routes
app.use(errorHandler);  // Must be last middleware

// ─── Bootstrap: Connect DB → then Start Server ───────────────
const startServer = async () => {
  try {
    await connectDB(); // Wait for DB before accepting traffic

    const server = app.listen(PORT, () => {
      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`🚀  Server   : http://localhost:${PORT}`);
      console.log(`📡  API Base : http://localhost:${PORT}/api/v1`);
      console.log(`❤️   Health  : http://localhost:${PORT}/api/v1/health`);
      console.log(`🌍  Mode     : ${NODE_ENV}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    });

    // ── Server-level error (e.g. port already in use) ──────────
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌  Port ${PORT} is already in use. Exiting...`);
      } else {
        console.error("❌  Server error:", err.message);
      }
      process.exit(1);
    });

    // ── Graceful Shutdown ─────────────────────────────────────
    const shutdown = (signal) => {
      console.log(`\n⚠️   ${signal} received — shutting down gracefully...`);
      server.close(() => {
        console.log("✅  HTTP server closed. Goodbye!\n");
        process.exit(0);
      });
      // Force-kill after 10 seconds
      setTimeout(() => {
        console.error("❌  Forced shutdown after timeout.");
        process.exit(1);
      }, 10_000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM")); // Cloud/Docker stop
    process.on("SIGINT",  () => shutdown("SIGINT"));  // Ctrl + C

  } catch (err) {
    console.error("❌  Failed to connect to database:", err.message);
    process.exit(1); // Exit — no point running without DB
  }
};

// ─── Process-Level Safety Nets ────────────────────────────────
process.on("unhandledRejection", (reason) => {
  console.error("🔥  Unhandled Promise Rejection:", reason);
  // Optionally force shutdown: process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("💥  Uncaught Exception:", err.message);
  console.error(err.stack);
  process.exit(1); // Always exit on uncaught exception
});

// ─── Start ────────────────────────────────────────────────────
startServer();

export default app;

