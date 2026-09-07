const express = require("express");
const cors = require("cors");
const productRoutes = require("./src/routes/productRoutes");
const authRoutes = require("./src/routes/authRoutes");
const cartRoutes = require("./src/routes/cartRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      // "http://localhost:3000",
    ],
  }),
);
app.use(express.json());
// const PORT = 3000;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// app.post("/post", (req, res) => {
//   res.send({ res: req.body });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`); // Use backticks here
// });

// const express = require("express");
// const app = express();
// app.use(express.json());
// const PORT = 3000;

// Simulated database
// let users = {};

// // GET - Check what's in the database
// app.get("/users", (req, res) => {
//   res.json(users);
// });

// // ==>GET
// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// Test route with authentication
app.get("/", (req, res) => {
  const authcode = req.get("authcode");

  if (authcode !== "1234") {
    return res.status(401).json({ message: "Invalid authcode" });
  }

  res.send("Hello, World222!");
});

//Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

// ==>POST
//==> send the entire body
// app.post("/post", (req, res) => {
//   res.send({ res: req.body });
// });

//==> send only the email
// app.post("/post", (req, res) => {
//   const { Email } = req.body;
//   res.json({ Email });
// });

// //==> send only the name
// app.post("/post", (req, res) => {
//   const { Name } = req.body;
//   res.json({ Name });
// });

// //==> Both (for comparison)
// app.post("/post", (req, res) => {
//   const { Name, Email } = req.body;
//   res.json({ Name, Email });
// });

// app.post("/post", (req, res) => {
//   const { Email: userEmail } = req.body; // Rename Email to userEmail
//   res.json({ userEmail });
// });
// // Response: { "userEmail": "Gmail@.com" }

// // Test POST route
// app.post("/post", (req, res) => {
//   const { Name, Email } = req.body;
//   res.json({ Name, Email });
//   //   res.send(Email); // Sends just the string "Gmail@.com"
// });
// // Response: "Gmail@.com" (plain text, not JSON)

// // //==>PUT
// // // Update (with ID in URL)
// // app.put("/users/:id", (req, res) => {
// //   const userId = req.params.id; // Get ID from URL
// //   const updatedData = req.body; // Get new data from body

// //   res.json({
// //     message: `User ${userId} updated successfully`,
// //     updatedUser: updatedData,
// //   });
// // });

// // PUT - Actually saves
// app.put("/users/:id", (req, res) => {
//   const userId = req.params.id;
//   const updatedData = req.body;

//   // Actually save it!
//   users[userId] = updatedData; // ← This is the key line!

//   res.json({
//     message: `User ${userId} updated successfully`,
//     updatedUser: users[userId],
//   });
// });

// // DELETE - Remove a user
// app.delete("/users/:id", (req, res) => {
//   const userId = req.params.id;

//   // Check if user exists
//   if (users[userId]) {
//     delete users[userId]; // Remove from database
//     res.json({
//       message: `User ${userId} deleted successfully`,
//       deletedUser: userId,
//     });
//   } else {
//     res.status(404).json({
//       error: `User ${userId} not found`,
//     });
//   }
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
