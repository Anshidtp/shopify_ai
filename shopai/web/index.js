import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import shopify from "./shopify.js";
import timerRoutes from "./routes/timers.js";
import widgetRoutes from "./routes/widget.js";
import aiRoutes from "./routes/ai.js";
import { join } from "path";
import { readFileSync } from "fs";

const PORT = parseInt(process.env.PORT || "3000", 10);
const app = express();

// Security
app.use(
  helmet({
    contentSecurityPolicy: false, // Shopify handles CSP
  })
);
app.use(morgan("dev"));

// Shopify auth setup
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: {} })
);

// Body parsing
app.use(express.json({ limit: "1mb" }));

// Public widget API (no Shopify auth needed)
app.use("/api/widget", widgetRoutes);

// Shopify-authenticated routes
app.use("/api/*", shopify.validateAuthenticatedSession());
app.use("/api/timers", timerRoutes);
app.use("/api/ai", aiRoutes);

// Serve React frontend
const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? join(process.cwd(), "frontend/dist")
    : join(process.cwd(), "frontend");

app.use(shopify.cspHeaders());
app.use(express.static(STATIC_PATH, { index: false }));
app.use("/*", shopify.ensureInstalledOnShop(), async (req, res) => {
  res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace(
          "%VITE_SHOPIFY_API_KEY%",
          process.env.SHOPIFY_API_KEY || ""
        )
    );
});

// Connect to MongoDB then start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });