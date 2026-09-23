const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/cms/auth", authRoutes);
app.use("/api/cms/admin", adminRoutes);

// Connect MongoDB
connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "Portfolio CMS Server is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CMS Server running on port ${PORT}`);
});