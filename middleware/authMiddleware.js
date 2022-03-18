const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.decode(token);
      req.user = await User.findById(decoded._id).select("-pin");
      // next();`
    } catch (e) {
      res.status(401);
      throw new Error("Not Authorized, no token")
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized, no token");
  }
  next();
});


module.exports = protect;

// const protect = asyncHandler(async (req, res, next) => {
//   let token;
//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.decode(token);
//       // console.log(decoded);
//       req.user = await User.findById(decoded._id).select("-pin");
//       // console.log(req.user);
//       next();
//     } catch (e) {
//       res.status(401);
//       throw new Error("Not Authorized, no token");
//     }
//   } else {
//     res.status(401);
//     throw new Error("Not Authorized, no token")
//   }
//   next();
// });