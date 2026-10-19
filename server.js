
const express = require("express");
const productRoutes = require("./routes/productRoutes");

const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = 3000;



app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later."
  }
});

app.use("/api", apiLimiter);

app.use(express.json());

// Log requests before the routes run
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Connect the product router
app.use("/api/products", productRoutes);

// Normal pages
app.get("/", (req, res) => {
  res.send("Welcome to my Express server!");
});

// Test error route
app.get("/api/test-error", (req, res, next) => {
  next(new Error("Something went wrong."));
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Central error handler — keep this last
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Internal server error.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
