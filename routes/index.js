var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user")
// root route
router.get("/",function(req,res){
    res.render("landing/index");
});

//register route
router.get("/register",function(req,res){
    res.render("register");
});

// handle sign up logic
router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username,designition:req.body.designition});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/family");
        });
    });
});

// show login
router.get("/login",function(req,res){
    res.render("login");
});

// handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect:"/family",
        failureRedirect: "/login"
    }),function(req,res){
    
});

// logout route
router.get("/logout",function(req,res){
    req.logOut();
    req.flash("success","logged you out")
    res.redirect("/family");
});

// middle ware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be login first");
    res.redirect("/login")
}

module.exports = router;