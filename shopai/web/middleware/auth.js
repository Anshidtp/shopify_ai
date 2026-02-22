import shopify from "../shopify.js";

// Middleware to extract and validate shop from session
export const requireShop = async (req, res, next) => {
  try {
    const session = res.locals.shopify?.session;
    if (!session?.shop) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.shop = session.shop;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};