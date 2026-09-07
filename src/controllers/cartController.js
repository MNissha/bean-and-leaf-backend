const pool = require("../config/db");

// Get user's cart
exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.id; // From JWT

    const result = await pool.query(
      `SELECT p.id, p.name, p.price, p.image, c.quantity 
             FROM carts c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = $1`,
      [userId],
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// Add item to cart
exports.addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    // Check if product already in cart
    const existing = await pool.query(
      "SELECT * FROM carts WHERE user_id = $1 AND product_id = $2",
      [userId, productId],
    );

    if (existing.rows[0]) {
      // Update quantity
      await pool.query(
        "UPDATE carts SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3",
        [quantity, userId, productId],
      );
    } else {
      // Add new item
      await pool.query(
        "INSERT INTO carts (user_id, product_id, quantity) VALUES ($1, $2, $3)",
        [userId, productId, quantity],
      );
    }

    res.json({ message: "Item added to cart" });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await pool.query(
      "DELETE FROM carts WHERE user_id = $1 AND product_id = $2",
      [userId, productId],
    );

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "DELETE FROM carts WHERE user_id = $1 RETURNING *",
      [userId],
    );

    res.json({
      message: "Cart cleared successfully",
      deletedCount: result.rowCount,
    });
  } catch (error) {
    next(error);
  }
};
