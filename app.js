var express         = require("express"),
    request         = require("request"),
    bodyparser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    app             = express(),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Family      = require("./models/family"),
    Member         = require("./models/member"),
    User            = require("./models/user"),
    seedDB          = require("./seeds")

// requiring routes
var memberRoutes       = require("./routes/member"),
    familyRoutes    = require("./routes/family"),
    indexRoutes         = require("./routes/index")

mongoose.connect("mongodb://localhost/data_manager_v4",{useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false });

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"i am a full stack developer",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(memberRoutes);
app.use(familyRoutes);

app.listen(process.env.PORT || 3000, process.env.IP,function(){
    console.log("Data Management server is started");
});