const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", protect, (req, res) => {
  res.status(200).json({
    message: "Protected CMS route accessed successfully",
    admin: req.admin,
  });
});

module.exports = router;