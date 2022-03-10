const mongoose = require("mongoose");

const NewUserSchema = mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const NewUser = mongoose.model("NewUser", NewUserSchema);

module.exports = NewUser;