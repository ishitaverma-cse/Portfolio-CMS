const express = require("express");

const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

// Public
router.get("/", getSkills);

// Admin only
router.post("/", protect, adminOnly, createSkill);
router.put("/:id", protect, adminOnly, updateSkill);
router.delete("/:id", protect, adminOnly, deleteSkill);

module.exports = router;