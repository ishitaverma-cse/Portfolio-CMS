const Skill = require("../models/Skill");

const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });

    res.status(200).json(skills);
  } catch (error) {
    console.error("Get skills error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);

    res.status(201).json({
      message: "Skill created successfully",
      skill,
    });
  } catch (error) {
    console.error("Create skill error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.status(200).json({
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    console.error("Update skill error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    console.log("Delete request ID:", req.params.id);
    console.log("Deleted skill:", skill);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.status(200).json({
      message: "Skill deleted successfully",
      deletedSkill: skill,
    });
  } catch (error) {
    console.error("Delete skill error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};