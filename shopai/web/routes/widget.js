import express from "express";
import { getWidgetTimer } from "../controllers/widgetController.js";
import { widgetLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/:shop/:productId", widgetLimiter, getWidgetTimer);

export default router;