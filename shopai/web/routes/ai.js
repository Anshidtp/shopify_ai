import express from "express";
import { generateTimer } from "../controllers/aiController.js";
import { requireShop } from "../middleware/auth.js";
import { aiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/generate", requireShop, aiLimiter, generateTimer);

export default router;