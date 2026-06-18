const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    bio: {
  type: String,
  default: ""
    }
      
    profilePhoto: {
      type: String,
      default: ""
    },

    bio: {
      type: String,
      default: "Hey there! I am using Rallygram."
    },

    isOnline: {
      type: Boolean,
      default: false
    },

    lastSeen: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
