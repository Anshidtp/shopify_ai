import Timer from "../models/Timer.js";
import { isTimerActiveForNow } from "../utils/timerStatus.js";

// GET /api/widget/:shop/:productId
// Public endpoint — used by the storefront widget
export const getWidgetTimer = async (req, res) => {
  try {
    const { shop, productId } = req.params;

    if (!shop || !productId) {
      return res.status(400).json({ error: "Missing shop or productId." });
    }

    // Fetch all active timers for the shop
    const timers = await Timer.find({ shop, isActive: true }).lean();

    // Filter to only truly active timers
    const activeTimers = timers.filter(isTimerActiveForNow);

    if (!activeTimers.length) {
      return res.json({ timer: null });
    }

    // Priority: product-specific > collection-specific > all
    const productTimer = activeTimers.find(
      (t) =>
        t.targeting.type === "products" &&
        t.targeting.resourceIds.includes(productId)
    );

    if (productTimer) return res.json({ timer: productTimer });

    // For collections, we'd need to check product membership
    // Simplified: return first "all" timer
    const allTimer = activeTimers.find((t) => t.targeting.type === "all");

    return res.json({ timer: allTimer || null });
  } catch (err) {
    console.error("getWidgetTimer error:", err);
    // Return null gracefully — widget should fail silently
    res.json({ timer: null });
  }
};