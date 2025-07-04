const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

// Route files
const linkRoutes = require("./routes/link.routes");

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error(err));

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Body parser for JSON requests

// Define a simple root route
app.get("/", (req, res) => {
  res.send("Link Sharer API is running!");
});

// Mount the routes
app.use("/api/links", linkRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
