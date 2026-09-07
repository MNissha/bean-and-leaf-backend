const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  getProductById,
  searchProducts,
} = require("../controllers/productController");
// const authenticate = require("../auth");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();

// GET all products
router.get("/", getAllProducts);

router.get("/search", searchProducts);

// ✅ GET single product - ADD THIS IF MISSING!
router.get("/:id", getProductById); // ← THIS IS THE MISSING ROUTE!

// POST create product (NEW)
router.post("/", authenticate, createProduct);

// PUT update product (NEW)
router.put("/:id", authenticate, updateProduct);

module.exports = router;
