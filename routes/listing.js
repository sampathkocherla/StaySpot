const express=require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validatelisting}=require("../middleware.js");
 
const listingControllers=require("../controllers/listings");
const multer  = require('multer')
const  {storage}=require("../CloudConfig.js");
const upload = multer({ storage })


//  show all listings(read route)
 router.get("/",wrapasync(listingControllers.index));
 
 // create route new listings
 router.get("/new",isLoggedIn, listingControllers.rendernewform);
  
 
// add route
  router.post("/newlist",upload.single("listing[image]",validatelisting),
   wrapasync(listingControllers.createlisting )
 );
  
 

/*show  single listing route*/
//  router.get("/:id",wrapasync(listingControllers.showlisting));
 
//edit route 
router.get("/:id/edit",isLoggedIn,isOwner,wrapasync(listingControllers.editlisting));
 
//update route
//  router.put("/:id", isLoggedIn,isOwner,validatelisting,  wrapasync(listingControllers.updatelisting));


//delete route 
// router.delete("/:id",isLoggedIn,wrapasync(listingControllers.deletelisting));
 
 router.route("/:id")
  .get(wrapasync(listingControllers.showlisting))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validatelisting,
    wrapasync(listingControllers.updatelisting)
  )
  .delete(isLoggedIn, wrapasync(listingControllers.deletelisting));
module.exports = router;