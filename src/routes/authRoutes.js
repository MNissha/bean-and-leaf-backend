const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// POST - Register new user
router.post("/register", register);

// POST - Login user
router.post("/login", login);

module.exports = router;
