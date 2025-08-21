
const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
  
const listingControllers=require("../controllers/users.js");
//signup route
router.get("/signup",listingControllers.signuprenderform);
  
 router.post("/signup", wrapasync(listingControllers.signup));

router.get("/login",listingControllers.loginform);
 
router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true,
    }),listingControllers.login
    );

router.get("/logout",listingControllers.logout );

module.exports=router;
