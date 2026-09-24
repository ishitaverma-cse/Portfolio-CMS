const Testimonial = require("../models/Testimonial");

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    res.status(200).json(testimonials);
  } catch (error) {
    console.error("Get testimonials error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);

    res.status(201).json({
      message: "Testimonial created successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Create testimonial error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!testimonial) {
      return res.status(404).json({
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      message: "Testimonial updated successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Update testimonial error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Delete testimonial error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};