import express from "express";
import {
  listTimers,
  getTimer,
  createTimer,
  updateTimer,
  deleteTimer,
  trackImpression,
} from "../controllers/timerController.js";
import { requireShop } from "../middleware/auth.js";
import { adminLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.use(requireShop);
router.use(adminLimiter);

router.get("/", listTimers);
router.get("/:id", getTimer);
router.post("/", createTimer);
router.put("/:id", updateTimer);
router.delete("/:id", deleteTimer);
router.post("/:id/impression", trackImpression);

export default router;