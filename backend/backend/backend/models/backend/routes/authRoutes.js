const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../User");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  try {
    const { name, username, phone, password } = req.body;

    if (!name || !username || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({
      $or: [{ phone }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      phone,
      password: hashedPassword
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        phone: user.phone,
        profilePhoto: user.profilePhoto,
        bio: user.bio
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password are required"
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone or password"
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone or password"
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        phone: user.phone,
        profilePhoto: user.profilePhoto,
        bio: user.bio
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});
// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find()
      .select("name username phone createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Users load failed",
    });
  }
});

// Update Profile
router.put("/profile/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const { name, phone, bio } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required"
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      {
        name: name,
        phone: phone,
        bio: bio || ""
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Profile update failed"
    });
  }
});

module.exports = router;
