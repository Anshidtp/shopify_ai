import fetch from "node-fetch";
import { sanitizeString } from "../utils/Sanitize.js";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export const generateTimer = async (req, res) => {
  try {
    const { productTitle, productCategory, intent } = req.body;

    if (!intent || typeof intent !== "string") {
      return res.status(400).json({ error: "Intent is required." });
    }

    const sanitizedIntent = sanitizeString(intent).slice(0, 200);
    const sanitizedTitle = sanitizeString(productTitle || "").slice(0, 100);
    const sanitizedCategory = sanitizeString(productCategory || "").slice(
      0,
      50
    );

    const aiResponse = await fetch(`${AI_SERVICE_URL}/generate-timer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_title: sanitizedTitle,
        product_category: sanitizedCategory,
        intent: sanitizedIntent,
      }),
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!aiResponse.ok) {
      const err = await aiResponse.json().catch(() => ({}));
      return res
        .status(502)
        .json({ error: "AI service error.", detail: err.detail || "" });
    }

    const data = await aiResponse.json();
    res.json({ suggestion: data });
  } catch (err) {
    console.error("AI generation error:", err);
    res.status(502).json({ error: "AI service unavailable." });
  }
};