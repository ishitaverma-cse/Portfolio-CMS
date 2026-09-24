const About = require("../models/About");

const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        message: "About content not found",
      });
    }

    res.status(200).json(about);
  } catch (error) {
    console.error("Get about error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateAbout = async (req, res) => {
  try {
    const about = await About.findOneAndUpdate(
      {},
      req.body,
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    );

    res.status(200).json({
      message: "About content updated successfully",
      about,
    });
  } catch (error) {
    console.error("Update about error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getAbout,
  updateAbout,
};