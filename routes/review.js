
const express=require("express");
const router=express.Router({mergeParams:true});
const wrapasync=require("../utils/wrapasync.js");
const review=require("../models/review.js");
 const {validateReview, isLoggedIn,  isAuthor }=require("../middleware.js");

const listingControllers=require("../controllers/review");

//create review route
router.post("/",isLoggedIn,validateReview,wrapasync(listingControllers.createreview));
 
//delete review
 router.delete("/:review_id",isLoggedIn,isAuthor, wrapasync(listingControllers.deletereview ));


module.exports=router;