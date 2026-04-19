import "./config/env.js";

import cors from "cors";
import express from "express";
import { connectDB } from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandlers.js";
import rateLimiter from "./middleware/rateLimiter.js";
import { uploadRoot } from "./middleware/uploadMiddleware.js";

import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;

// 🌐 Allowed origins (Local + Production)
const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend.vercel.app", // 🔁 replace after deployment
];

// ✅ CORS (works for both local + deployed)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// ⚙️ Middleware
app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// 📁 Static uploads (temporary storage)
app.use(
  "/uploads",
  express.static(uploadRoot, {
    immutable: true,
    maxAge: "7d",
  })
);

// ❤️ Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AstraDev API",
    timestamp: new Date().toISOString(),
  });
});

// 🔌 Routes
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/admin", adminRoutes);

// ❌ NOT FOUND handler
app.use(notFoundHandler);

// ❌ ERROR handler
app.use(errorHandler);

// 🚀 Start server safely
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`🚀 AstraDev server running on port ${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.warn(`⚠️ Port ${port} in use. Trying ${port + 1}...`);
      startServer(port + 1);
      return;
    }

    console.error("❌ Server startup error:", error);
    process.exit(1);
  });
};

// 🔗 Connect DB and start
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected");
    startServer(Number(PORT));
  })
  .catch((error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  });