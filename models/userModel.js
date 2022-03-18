const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const UserSchema = mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  pin: {
    type: String,
  },
  balance: {
    type: String,
  },
  loadTransactions: {
    type: String,
  },
  allTransactions: {
    type: String,
  },
  otp: {
    type: String,
    required: true,
  },
  tokens: [{
    token: {
      type: String,
    }
  }]
}, {
  timestamps: true,
});


UserSchema.virtual("businesses", {
  ref: "Business",
  localField: "_id",
  foreignField: "user"
});

// userSchema.virtual("tasks", {
//   ref: "Task",
//   localField: "_id",
//   foreignField: "owner"
// })


UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
}

UserSchema.statics.findByCredentials = async (phone, pin) => {
  const user = await User.findOne({ phone });
  if (!user.pin) {
    throw new Error("Pin is not created");
  }
  const isMatch = await bcryptjs.compare(pin, user.pin);
  if (!isMatch) {
    throw new Error("Pin is incorrect");
  }
  return user;
}

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("pin")) {
    user.pin = await bcryptjs.hash(user.pin, 8);
  }
  next();
})

const User = mongoose.model("User", UserSchema);

module.exports = User;