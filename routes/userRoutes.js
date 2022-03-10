const express = require("express");
const router = express.Router();
const { newUser, verifyNewUserOtp, createUserPin, login, reset } = require("../controllers/userController");

router.route("/genrateotp").post(newUser);
router.route("/verifyotp").post(verifyNewUserOtp);
router.route("/createpin").put(createUserPin);
router.route("/login").post(login);
router.route("/resetpin").post(reset);


module.exports = router;