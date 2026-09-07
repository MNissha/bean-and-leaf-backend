const express = require("express");
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// All cart routes require authentication
router.get("/", authenticate, getCart);
router.post("/", authenticate, addToCart);
router.delete("/:productId", authenticate, removeFromCart);
router.delete("/", authenticate, clearCart);

module.exports = router;
