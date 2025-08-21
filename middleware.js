const Listing = require("./models/listing.js");
const review = require("./models/review.js");
const {listingSchema}=require("./schema.js");
const Expresserror = require("./utils/expresserror");
const {reviewSchema}=require("./schema.js");
 


module.exports.isLoggedIn=(req,res,next)=>{
     if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
      req.flash("error","You must be logged in before creat a listing");
      return res.redirect("/login");
    }
    next();
}
  
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}

// module.exports.isowner=async(req,res,next)=>{
//    let { id } = req.params;
//    let listing = await Listing.findById(id);
//     if (!res.locals.currentuser || !listing.owner.equals(res.locals.currentuser._id)) {
//         req.flash("error", "You don't have permission to edit");
//         return res.redirect(`/listings/${id}`);
//     }
//     next();
// }
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    // If no listing found
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    // If no user is logged in OR user is not the owner
    if (!res.locals.currentuser || !listing.owner.equals(res.locals.currentuser._id)) {
        req.flash("error", "You are not the owner");
        return res.redirect(`/listings/${id}`);
    }

    // User is owner → allow edit
    next();
};


module.exports.validatelisting=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errmsg=error.details.map((el)=>el.message).join(",");
    throw new Expresserror(404,errmsg)
  }else{
    next();
  }
};
  module.exports.validateReview=(req,res,next)=>{
     if (req.body.review && req.body.review.rating) {
        req.body.review.rating = Number(req.body.review.rating);
    }
     let {error} =reviewSchema.validate(req.body);
   if(error){
    let errmsg=error.details.map((el)=>el.message).join(',');

    throw new Expresserror(400,errmsg);
   }
   else{
    next();
   }
}
  