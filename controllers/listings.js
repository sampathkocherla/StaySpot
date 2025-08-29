 const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/listing", { data: listings });
};

module.exports.rendernewform = (req, res) => {
  res.render("listings/newlist");
};

 module.exports.createlisting = async (req, res) => {
  const { location } = req.body.listing;  // ✅ fixed
  const { path, filename } = req.file;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url: path, filename };

  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/search?key=${process.env.LOCATIONIQ_API_KEY}&q=${encodeURIComponent(location)}&format=json`
    );
    const geoData = await response.json();

    if (geoData && geoData.length > 0) {
      newListing.geometry = {
        type: "Point",
        coordinates: [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)], // GeoJSON format
      };
    } else {
      console.warn("No coordinates found for location:", location);
    }
  } catch (err) {
    console.error("Failed to fetch coordinates:", err.message);
  }

  await newListing.save();
  req.flash("success", "New listing created !");
  res.redirect("/listings");
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
