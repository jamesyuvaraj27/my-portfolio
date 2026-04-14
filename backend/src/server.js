import "./config/env.js";

import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandlers.js";
import rateLimiter from "./middleware/rateLimiter.js";
import { uploadRoot } from "./middleware/uploadMiddleware.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.set("trust proxy", 1);

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: clientOrigin,
      credentials: true,
    })
  );
}

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);
app.use(
  "/uploads",
  express.static(uploadRoot, {
    immutable: true,
    maxAge: "7d",
  })
);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AstraDev API",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/admin", adminRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`AstraDev server listening on port ${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.warn(`Port ${port} already in use. Trying port ${port + 1}...`);
      startServer(port + 1);
      return;
    }

    console.error("Server startup error:", error);
    process.exit(1);
  });
};

connectDB()
  .then(() => {
    startServer(Number(PORT));
  })
  .catch((error) => {
    console.error("Failed to start AstraDev", error);
    process.exit(1);
  });
