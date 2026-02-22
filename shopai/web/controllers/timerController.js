import Timer from "../models/Timer.js";
import { sanitizeTimerInput } from "../utils/Sanitize.js";
import { isTimerActiveForNow } from "./utils/timerStatus.js";

// GET /api/timers
export const listTimers = async (req, res) => {
  try {
    const timers = await Timer.find({ shop: req.shop }).sort({
      createdAt: -1,
    });
    res.json({ timers });
  } catch (err) {
    console.error("listTimers error:", err);
    res.status(500).json({ error: "Failed to fetch timers." });
  }
};

// GET /api/timers/:id
export const getTimer = async (req, res) => {
  try {
    const timer = await Timer.findOne({ _id: req.params.id, shop: req.shop });
    if (!timer) return res.status(404).json({ error: "Timer not found." });
    res.json({ timer });
  } catch (err) {
    console.error("getTimer error:", err);
    res.status(500).json({ error: "Failed to fetch timer." });
  }
};

// POST /api/timers
export const createTimer = async (req, res) => {
  try {
    const data = sanitizeTimerInput(req.body);

    if (data.type === "fixed") {
      if (!data.startDate || !data.endDate) {
        return res
          .status(400)
          .json({ error: "Fixed timers require startDate and endDate." });
      }
      if (data.endDate <= data.startDate) {
        return res
          .status(400)
          .json({ error: "endDate must be after startDate." });
      }
    }

    if (data.type === "evergreen" && !data.durationHours) {
      return res
        .status(400)
        .json({ error: "Evergreen timers require durationHours." });
    }

    const timer = await Timer.create({
      ...data,
      shop: req.shop,
      aiGenerated: req.body.aiGenerated === true,
    });

    res.status(201).json({ timer });
  } catch (err) {
    console.error("createTimer error:", err);
    res.status(500).json({ error: "Failed to create timer." });
  }
};

// PUT /api/timers/:id
export const updateTimer = async (req, res) => {
  try {
    const data = sanitizeTimerInput(req.body);
    const timer = await Timer.findOneAndUpdate(
      { _id: req.params.id, shop: req.shop },
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!timer) return res.status(404).json({ error: "Timer not found." });
    res.json({ timer });
  } catch (err) {
    console.error("updateTimer error:", err);
    res.status(500).json({ error: "Failed to update timer." });
  }
};

// DELETE /api/timers/:id
export const deleteTimer = async (req, res) => {
  try {
    const timer = await Timer.findOneAndDelete({
      _id: req.params.id,
      shop: req.shop,
    });
    if (!timer) return res.status(404).json({ error: "Timer not found." });
    res.json({ message: "Timer deleted." });
  } catch (err) {
    console.error("deleteTimer error:", err);
    res.status(500).json({ error: "Failed to delete timer." });
  }
};

// POST /api/timers/:id/impression
export const trackImpression = async (req, res) => {
  try {
    await Timer.findByIdAndUpdate(req.params.id, { $inc: { impressions: 1 } });
    res.status(204).send();
  } catch (err) {
    // Fail silently — impressions are not critical
    res.status(204).send();
  }
};