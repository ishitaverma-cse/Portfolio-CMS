const express = require("express");

const {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

// Public
router.get("/", getExperiences);

// Admin only
router.post("/", protect, adminOnly, createExperience);
router.put("/:id", protect, adminOnly, updateExperience);
router.delete("/:id", protect, adminOnly, deleteExperience);

module.exports = router;