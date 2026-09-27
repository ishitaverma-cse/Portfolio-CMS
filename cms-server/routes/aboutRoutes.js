const express = require("express");

const {
  getAbout,
  updateAbout,
} = require("../controllers/aboutController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

// Public
router.get("/", getAbout);

// Admin only
router.put("/", protect, adminOnly, updateAbout);

module.exports = router;