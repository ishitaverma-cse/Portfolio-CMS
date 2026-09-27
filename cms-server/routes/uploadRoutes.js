const express = require("express");

const upload = require("../middleware/uploadMiddleware");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");
const { uploadFile } = require("../controllers/uploadController");

const router = express.Router();

// Admin only
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("file"),
  uploadFile
);

module.exports = router;