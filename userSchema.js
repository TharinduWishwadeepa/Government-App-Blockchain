//database realted codes such as schema details

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("user", userSchema);
