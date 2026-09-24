const Service = require("../models/Service");

const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });

    res.status(200).json(services);
  } catch (error) {
    console.error("Get services error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create service error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Update service error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete service error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
};