 const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/listing", { data: listings });
};

module.exports.rendernewform = (req, res) => {
  res.render("listings/newlist");
};

module.exports.createlisting = async (req, res, next) => {
  try {
    const { path: url, filename } = req.file;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  } catch (e) {
    next(e);
  }
};

module.exports.showlisting = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  res.render("listings/show.ejs", { list: listing });
};

module.exports.editlisting = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
};

module.exports.updatelisting = async (req, res) => {
  const { id } = req.params;
  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );
  if (req.file) {
    updatedListing.image = { url: req.file.path, filename: req.file.filename };
    await updatedListing.save();
  }
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deletelisting = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
