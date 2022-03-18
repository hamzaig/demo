const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type: String,
    trim: true,
    ref: "User",
  },
  type: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
}, {
  timestamps: true,
})

const Business = mongoose.model("Business", businessSchema);

module.exports = Business;