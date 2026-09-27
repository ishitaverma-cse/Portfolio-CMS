const express = require("express");

const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

// Public
router.get("/", getTestimonials);

// Admin only
router.post("/", protect, adminOnly, createTestimonial);
router.put("/:id", protect, adminOnly, updateTestimonial);
router.delete("/:id", protect, adminOnly, deleteTestimonial);

module.exports = router;