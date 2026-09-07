const pool = require("../config/db");

const normalizeProduct = (product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  description: product.description,
  category: product.category,
  brand: product.brand,
  stock: product.stock,
  rating: product.rating,
  image: product.image,
});

// GET - All products
exports.getAllProducts = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows.map(normalizeProduct));
  } catch (error) {
    next(error);
  }
};

//GET single product
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Fetching product with ID: ${id}`);

    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(normalizeProduct(result.rows[0]));
  } catch (error) {
    console.error("❌ Error in getProductById:", error);
    next(error);
  }
};

// POST - Create new product
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, brand, stock, rating, image } =
      req.body;

    // Validation
    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Name and price are required",
      });
    }

    const result = await pool.query(
      "INSERT INTO products (name, description, price, category, brand, stock, rating, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [name, description, price, category, brand, stock, rating, image],
    );

    res.status(201).json({
      message: "Product created successfully",
      product: normalizeProduct(result.rows[0]),
    });
  } catch (error) {
    next(error);
  }
};

// PUT - Update product
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, brand, stock, rating, image } =
      req.body;

    // Validation
    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Name and price are required",
      });
    }

    const result = await pool.query(
      "UPDATE products SET name = $1, description = $2, price = $3, category = $4, brand = $5, stock = $6, rating = $7, image = $8 WHERE id = $9 RETURNING *",
      [name, description, price, category, brand, stock, rating, image, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: `Product with ID ${id} not found`,
      });
    }

    res.json({
      message: "Product updated successfully",
      product: normalizeProduct(result.rows[0]),
    });
  } catch (error) {
    next(error);
  }
};

// GET - Search products
exports.searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query; // Gets ?q=mug

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Use ILIKE for case-insensitive partial matching
    const result = await pool.query(
      `SELECT * FROM products 
       WHERE name ILIKE $1 
       OR description ILIKE $1 
       OR category ILIKE $1 
       OR brand ILIKE $1`,
      [`%${q}%`],
    );

    // Wrap it in an object to match your frontend request
    res.json({ products: result.rows.map(normalizeProduct) });
  } catch (error) {
    console.error("❌ Error in searchProducts:", error);
    next(error);
  }
};
