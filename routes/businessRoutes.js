const express = require("express");
const { createBusiness, getAllBusinesses, getBusiness, updateBusiness, deleteBusiness } = require("../controllers/businessController");
const router = express.Router();
const protect = require("../middleware/authMiddleware");


router.route("/").post(protect, createBusiness).get(protect, getAllBusinesses);
router.route("/:id").get(protect, getBusiness).put(protect, updateBusiness).delete(protect, deleteBusiness);


module.exports = router;