const Experience = require("../models/Experience");

const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1 });

    res.status(200).json(experiences);
  } catch (error) {
    console.error("Get experiences error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const createExperience = async (req, res) => {
  try {
    const experience = await Experience.create(req.body);

    res.status(201).json({
      message: "Experience created successfully",
      experience,
    });
  } catch (error) {
    console.error("Create experience error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found",
      });
    }

    res.status(200).json({
      message: "Experience updated successfully",
      experience,
    });
  } catch (error) {
    console.error("Update experience error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found",
      });
    }

    res.status(200).json({
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("Delete experience error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
};