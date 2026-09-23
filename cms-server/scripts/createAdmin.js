const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const Admin = require("../models/Admin");

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({
      email: "admin@portfolio.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await Admin.create({
      name: "Portfolio Admin",
      email: "admin@portfolio.com",
      password: hashedPassword,
    });

    console.log("Admin created successfully");
    console.log("Admin ID:", admin._id);

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
  }
};

createAdmin();