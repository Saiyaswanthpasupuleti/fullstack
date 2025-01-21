const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const mongoose = require("mongoose");

// Initialize app and port
const app = express();
const port = 3500;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://saiyaswanths959:1P8oF8tdU7UdbHXF@cluster0.wq3w4.mongodb.net/signup"
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

// Start the server
app.listen(port, () => {
  console.log(`server running`);
});
