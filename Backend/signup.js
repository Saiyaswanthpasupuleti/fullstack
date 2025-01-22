const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config()
// Initialize app and port
const app = express();
const port = 3500;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(
    process.env.DATABASE
  )
  .then(() => {
    console.log("Database connected succesfull");
  })
  .catch((err) => {
    console.log(err);
  });
// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
  photo: { type: String },
});

// User Model
const User = mongoose.model("userinfo", userSchema);

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});
const upload = multer({ storage });

// Signup Route
app.post("/api/signup", upload.single("photo"), async (req, res) => {
  const { name, email, password, userType } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userType,
      photo: req.file ? req.file.path : null,
    });

    // Save user to MongoDB
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: "Signup successful!", user: newUser });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "An error occurred during signup." });
  }
});


app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Respond with success message
    res.status(200).json({ message: "Login successful!", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`server running`);
});
