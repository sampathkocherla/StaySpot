
const express=require("express");
const router=express.Router({mergeParams:true});
const wrapasync=require("../utils/wrapasync.js");
const Expresserror = require("../utils/expresserror");
const review=require("../models/review.js");
const Listing = require("../models/listing.js");
 const {validateReview, isLoggedIn,  isAuthor }=require("../middleware.js");

const listingControllers=require("../controllers/review");

//create review route
router.post("/",isLoggedIn,validateReview,wrapasync(listingControllers.createreview));
 
//delete review
 router.delete("/:review_id",isLoggedIn, wrapasync(listingControllers.deletereview ));


module.exports=router;