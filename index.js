if(process.env.NODE_ENV !="production"){
 require('dotenv').config();
}
 
 
const express=require("express");
const app=express();
const port = process.env.PORT || 8080;
 

const path=require("path");
const mongoose=require("mongoose");
const ejs=require("ejs");
const Listing = require("./models/listing.js");
const methodOverride=require("method-override");
const engine = require('ejs-mate');
const wrapasync=require("./utils/wrapasync.js");
const Expresserror = require("./utils/expresserror");
const review=require("./models/review.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const listingRoutes = require('./routes/listing');
const reviewRoutes = require("./routes/review");
const UserRoutes=require("./routes/user.js");


const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
const { console } = require('inspector');


 app.use(express.json()); 
app.engine('ejs', engine);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
 
 const dburl=process.env.ATLASDB_URL;
 
 
main()
 .then((res)=>{
    console.log("succesfully connected to mongoDB");
 }).catch((err)=>{
    console.log(err);
 });
async function main(){
    await mongoose.connect(dburl);
};
   
 const store= MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
 });
 store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE",err);
 });
const sessionoptions={
  store,
  secret: process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+1000*60*60*24*3,
    maxAge:1000*60*60*24*3,
    httpOnly:true
  },
};

app.use(session(sessionoptions));
app.use(flash());
 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error = req.flash("error"); 
  res.locals.currentuser=req.user;
  next();
});
 
app.get("/registerUser",async(req,res)=>{
  let fakeUser=new User({
    email:"sampathkocherla7@gmail.com",
    username:"sampath_shannu",
  });
  let newUser=await User.register(fakeUser,"helloworld");
  res.send(newUser);
});


 app.use("/listings",listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/",UserRoutes);
 
 app.get("/",(req,res)=>{
    res.redirect("/listings");
});
 
//  app.use("", (req, res, next) => {
//   next(new Expresserror(404, "Page Not Found!"));
// });


app.use((err,req, res, next) => {
  console.log(err);
  let { statusCode=500, message="something went wrong "} = err;
  res.render("./listings/error.ejs",{message});
});
 app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
 
 