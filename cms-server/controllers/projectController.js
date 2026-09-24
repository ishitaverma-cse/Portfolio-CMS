const Project = require("../models/Project");

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Get projects error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update project error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    console.log("Delete request ID:", req.params.id);
    console.log("Deleted project:", project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project deleted successfully",
      deletedProject: project,
    });
  } catch (error) {
    console.error("Delete project error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};