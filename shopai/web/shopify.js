import { shopifyApp } from "@shopify/shopify-app-express";
import { MongoDBSessionStorage } from "@shopify/shopify-app-session-storage-mongodb";
import { LATEST_API_VERSION } from "@shopify/shopify-api";

const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources: {},
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  sessionStorage: new MongoDBSessionStorage(
    new URL(process.env.MONGODB_URI),
    "countdown_app"
  ),
});

export default shopify;