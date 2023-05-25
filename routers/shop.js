import express from "express";
const router = express.Router();
import {
  getCategories,
  getProducts,
  getProductBySlug,
  getProductsByCategory,
  getProductsBySearch,
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateCart,
  getOrders,
  createOrder,
  createOrderStripe,
  stripeWebhook,
  getCheckoutSession,
} from "../controllers/shop.js";
import authenticate from "../middlewares/auth.js";


router.get("/categories", getCategories);

router.get("/products/category/:category", getProductsByCategory);
router.get("/products/search/:search", getProductsBySearch);
router.get("/products/:slug", getProductBySlug);
router.get("/products", getProducts);

router.get("/cart", authenticate, getCart);
router.post("/cart/add",authenticate, addToCart);
router.post("/cart/remove", authenticate, removeFromCart);
router.post("/cart/clear", authenticate, clearCart);
router.post("/cart/update", authenticate, updateCart);

router.post("/orders", authenticate, getOrders);
router.post("/orders/create", authenticate, createOrder);

router.post("/orders/create-checkout-session", authenticate, createOrderStripe);
router.post("/orders/webhook", express.raw({ type: "application/json" }), stripeWebhook);
router.get("/orders/checkout-session/:sessionId", authenticate, getCheckoutSession);

export default router;
