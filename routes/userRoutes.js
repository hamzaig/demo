const express = require("express");
const router = express.Router();
const { newUser, verifyNewUserOtp, createUserPin, login, reset, changePin } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.route("/changePin").post(protect, changePin);
router.route("/genrateotp").post(newUser);
router.route("/verifyotp").post(verifyNewUserOtp);
router.route("/createpin").put(createUserPin);
router.route("/login").post(login);
router.route("/resetpin").post(reset);


module.exports = router;