
const review=require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createreview=async(req,res)=>{
   let listing=await Listing.findById(req.params.id);
   let newReview=new review( req.body.review);
   newReview.author=req.user._id;
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
    req.flash("success","Review created Successfully");
   res.redirect(`/listings/${listing._id}`);
   
}
  
module.exports.deletereview=async (req, res, next) => {
   let { id, review_id } = req.params;
   await Listing.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
   await review.findByIdAndDelete(review_id);
   req.flash("success","review deleted!");
   res.redirect(`/listings/${id}`);
}