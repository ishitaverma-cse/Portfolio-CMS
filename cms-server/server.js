const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const skillRoutes = require("./routes/skillRoutes");
const projectRoutes = require("./routes/projectRoutes");
const blogRoutes = require("./routes/blogRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/cms/auth", authRoutes);
app.use("/api/cms/admin", adminRoutes);
app.use("/api/cms/about", aboutRoutes);
app.use("/api/cms/skills", skillRoutes);
app.use("/api/cms/projects", projectRoutes);
app.use("/api/cms/blogs", blogRoutes);
app.use("/api/cms/experience", experienceRoutes);
app.use("/api/cms/testimonials", testimonialRoutes);
app.use("/api/cms/services", serviceRoutes);

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