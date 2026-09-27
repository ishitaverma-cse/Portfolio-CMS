const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("../models/User");

dotenv.config();

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    const existingUser = await User.findOne({
      email: "user@portfolio.com",
    });

    if (existingUser) {
      console.log("User already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("User@123", 10);

    const user = await User.create({
      name: "Portfolio User",
      email: "user@portfolio.com",
      password: hashedPassword,
      role: "user",
    });

    console.log("User created successfully");
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log("Role:", user.role);

    process.exit(0);
  } catch (error) {
    console.error("Error creating user:", error.message);
    process.exit(1);
  }
};

createUser();