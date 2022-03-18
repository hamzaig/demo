const asyncHandler = require("express-async-handler");
const Business = require("../models/businessModel");

/*
@desc     create new business
@route    POST /api/business
@access   private
*/
const createBusiness = asyncHandler(async (req, res) => {

  const { ownerName, name, mobileNumber, type, category, address, email } = req.body;
  const business = new Business({
    ownerName, name, mobileNumber, type, category, address, email, user: req.user._id
  });
  await business.save();
  res.status(201).send();
})

/*
@desc     Get All business
@route    GET /api/business
@access   private
*/
const getAllBusinesses = asyncHandler(async (req, res) => {
  await req.user.populate("businesses");
  if (req.user.businesses.length === 0) {
    throw new Error("There is no business please add first");
  } else {
    res.send(req.user.businesses)
  }
})

/*
@desc     Get business by id
@route    GET /api/business/:id
@access   private
*/
const getBusiness = asyncHandler(async (req, res) => {
  const business = await Business.findById(req.params.id);
  if (!business) {
    throw new Error("Business not found");
  } else {
    res.send(business);
  }
})

/*
@desc     Update business by id
@route    PUT /api/business/:id
@access   private
*/
const updateBusiness = asyncHandler(async (req, res) => {
  const business = await Business.findById(req.params.id);
  if (!business) {
    throw new Error("Business not found");
  } else {
    business.ownerName = req.body.ownerName || business.ownerName;
    business.name = req.body.name || business.name;
    business.mobileNumber = req.body.mobileNumber || business.mobileNumber;
    business.type = req.body.type || business.type;
    business.category = req.body.category || business.category;
    business.address = req.body.address || business.address;
    business.email = req.body.email || business.email;
    await business.save();
    res.status(201).send(business);
  }
})

/*
@desc     Delete business by id
@route    Delete /api/business/:id
@access   private
*/
const deleteBusiness = asyncHandler(async (req, res) => {
  const business = await Business.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!business) {
    throw new Error("Business not found");
  } else {
    res.status(200).send(business);
  }
})

module.exports = {
  createBusiness,
  getAllBusinesses,
  getBusiness,
  updateBusiness,
  deleteBusiness
}

