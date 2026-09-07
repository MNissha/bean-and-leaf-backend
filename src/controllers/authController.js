const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const { signAccessToken } = require("../config/auth");

// REGISTER - Create new user
exports.register = async (req, res, next) => {
  try {
    const { name = null, email, password } = req.body || {};

    // Validation: Check if email and password exist
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Validation: Password length
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    // Normalize email (trim and lowercase)
    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      normalizedEmail,
    ]);

    if (existing.rows[0]) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert new user into database
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at, updated_at`,
      [name, normalizedEmail, passwordHash],
    );

    // ✅ Create safe user object (no password_hash)
    const safeUser = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      created_at: result.rows[0].created_at,
      updated_at: result.rows[0].updated_at,
    };

    // ✅ Generate JWT token
    const token = signAccessToken({
      sub: String(safeUser.id),
      email: safeUser.email,
    });

    // Return success response
    res.status(201).json({
      message: "User registered successfully",
      // user: result.rows[0],
      user: safeUser,
      token: token,
    });
  } catch (error) {
    // Handle unique constraint violation
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Email already registered",
      });
    }
    next(error);
  }
};

// // LOGIN - For later
// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // Validation
//     if (!email || !password) {
//       return res.status(400).json({
//         message: "Email and password are required",
//       });
//     }

//     const normalizedEmail = email.trim().toLowerCase();

//     // Find user by email
//     const result = await pool.query(
//       "SELECT id, name, email, password_hash FROM users WHERE email = $1",
//       [normalizedEmail],
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({
//         message: "Invalid email or password",
//       });
//     }

//     const user = result.rows[0];

//     // Compare password
//     const isValidPassword = await bcrypt.compare(password, user.password_hash);

//     if (!isValidPassword) {
//       return res.status(401).json({
//         message: "Invalid email or password",
//       });
//     }

//     // Remove password_hash from response
//     delete user.password_hash;

//     res.json({
//       message: "Login successful",
//       user: user,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// Login function
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    // Validation: Check if email and password exist (same style as register)
    if (typeof email !== "string" || typeof password !== "string") {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    // Normalize email (same as register)
    const normalizedEmail = email.trim().toLowerCase();

    // Find user by email
    const result = await pool.query(
      `SELECT id, name, email, password_hash, created_at, updated_at
       FROM users 
       WHERE email = $1`,
      [normalizedEmail],
    );

    const user = result.rows[0];

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password with hashed password (using bcrypt)
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Create safe user object (no password_hash)
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    // ✅ Generate JWT token
    const token = signAccessToken({
      sub: String(safeUser.id),
      email: safeUser.email,
    });

    // Remove password_hash from response (security)
    delete user.password_hash;

    // Return success response (same format as register)
    res.json({
      message: "Login successful",
      // user: user,
      user: safeUser,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};
