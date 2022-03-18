const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const NewUser = require("../models/newUsers");
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/*
@desc     new user otp generate
@route    POST /api/users/genrateotp
@access   public
*/
const newUser = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const user = await User.findOne({ phone });
  const newUsers = await NewUser.find({ phone });
  if (newUsers.length >= 2) {
    setTimeout(async () => {
      await NewUser.deleteMany({ phone });
    }, 3600000);
    throw new Error("Please Try After 1 hour")
  }
  if (user) {
    if (!user.pin) {
      await User.deleteMany({ phone });
    } else {
      throw new Error("user Already registered");
    }
  }
  const otp = Math.floor(1000 + Math.random() * 9000);
  const newUser = new NewUser({
    phone,
    otp
  })
  await newUser.save();

  // await client.messages.create({
  //   body: `Mobi Khata: Your OTP is ${otp}. please dont share with anyone`,
  //   from: '+16812486771',
  //   to: "+923057777911"
  // })

  res.status(201).send({ message: "Otp Generated" });
});

/*
@desc     verify new user otp 
@route    POST /api/users/verifyotp
@access   public
*/
const verifyNewUserOtp = asyncHandler(async (req, res, next) => {
  const { otp, phone } = req.body;
  const existuser = await User.findOne({ phone })
  if (existuser) {
    throw new Error("user already saved");
    return;
  }
  const verifyOtp = await NewUser.findOne({ otp });
  if (!verifyOtp && verifyOtp?.phone !== phone) {
    throw new Error("Otp is not matched");
  }
  const user = new User({
    phone,
    otp,
  })
  await user.save();
  res.status(201).send(user);
});

/*
@desc     create pin  
@route    PUT /api/users/createPin
@access   public
*/
const createUserPin = asyncHandler(async (req, res, next) => {
  const { otp, phone, pin } = req.body;
  const user = await User.findOne({ otp, phone });
  if (!user && user?.phone !== phone && user?.otp !== otp) {
    throw new Error("Otp is not matched");
  } else if (!pin) {
    throw new Error("pin is required now");
  }
  user.pin = pin;
  await user.save();
  const token = await user.generateAuthToken();
  res.status(201).send({ user, token });
});


/*
@desc     login  
@route    Post /api/users/login
@access   public
*/
const login = asyncHandler(async (req, res, next) => {
  const { phone, pin } = req.body;
  const user = await User.findByCredentials(phone, pin);
  const token = await user.generateAuthToken();
  res.status(200).send({ user, token });
});
/*
@desc     Reset Pin  
@route    Post /api/users/resetpin
@access   public
*/
const reset = asyncHandler(async (req, res, next) => {
  const randomOtp = Math.floor(1000 + Math.random() * 9000);
  const { phone, otp, pin } = req.body;
  const user = await User.findOne({ phone });
  if (!user) {
    throw new Error("user is not found")
  } else if (!otp && !pin) {
    user.otp = randomOtp;
    await user.save();
    res.send("otp generated");
  } else if (!pin && phone && otp) {
    if (user.otp === otp) {
      res.send("otp matched");
    } else {
      throw new Error("Otp is not matched");
    }
  } else if (phone, otp, pin) {
    if (user.otp === otp) {
      user.pin = pin;
      await user.save();
      res.send("pin is changed")
    } else {
      throw new Error("Otp is not matched");
    }
  }
});

/*
@desc     change pin  
@route    Post /api/users/changePin
@access   private
*/
const changePin = asyncHandler(async (req, res, next) => {
  const { pin, newPin } = req.body;
  const user = req.user;
  const newUser = await User.findByCredentials(user.phone, pin)
  if (newUser) {
    user.pin = newPin;
    await user.save();
    res.status(200).send("Pin is changed")
  } else {
    res.status(401).send("Pin is not matched");
    throw new Error("Pin is not matched");
  }
});



module.exports = { newUser, verifyNewUserOtp, createUserPin, login, reset, changePin };