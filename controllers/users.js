const User=require("../models/user.js");
module.exports.signuprenderform=(req,res)=>{
    res.render("./users/signup.ejs");
}

module.exports.signup=async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const regtduser = await User.register(user, password); 
        console.log(regtduser);

        req.login(regtduser, (err) => {
            if (err) {
                return next(err); // pass the error to Express error handler
            }
            req.flash("success", "Welcome to Wunderlust!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message); 
        res.redirect("/signup");
    }
}

module.exports.loginform=(req,res)=>{
    res.render("./users/login.ejs");
}
module.exports.login= async(req,res)=>{
        req.flash("success","welcome wonderlust you are logged in");
        let redirectUrl=res.locals.redirectUrl ||"/listings";
        res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You were logged out");
        res.redirect("/listings");
    });
}