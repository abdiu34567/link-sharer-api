const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

// Route files
const linkRoutes = require("./routes/link.routes");

// Load environment variables
dotenv.config();

const app = express();

// --- DATABASE CONNECTION ---
// It's crucial to connect to the DB here. Vercel will run this code once
// on "cold start" of the function.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected for Vercel..."))
  .catch((err) => console.error(err));

// Middleware
app.use(cors());
app.use(express.json());

// Mount the routes
// The Express app will handle all routes starting from the root '/'
// The vercel.json file will ensure that only requests to /api/* reach this app.
app.use("/api/links", linkRoutes);

// We only want to start a server (app.listen) if this file is run directly.
// If it's imported by Vercel (or another file), we just want to export the app.
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`✅ Server is running locally on port ${PORT}`);
  });
}

// IMPORTANT: Export the app object
module.exports = app;

// REMOVED THE app.listen() part entirely. Vercel handles this.
