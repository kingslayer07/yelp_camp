var express               = require("express"),
    request               = require("request"),
    passport              = require("passport"),
    localStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    mongoose              = require("mongoose"),
    Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    flash                 = require("connect-flash"),
    User                  = require("./models/user"),
    methodOverride        = require("method-override",)
    seedDB                = require("./seeds");
    
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
// seedDB(); // seed the database

 
var app = express()


//to convert incoming request object into json object
app.use(express.json());
// to convert incoming request object into string and array
app.use(express.urlencoded()); //Parse URL-encoded bodies
app.use(flash());
app.use(require( "express-session")({
    secret : "Winter is Coming",
    resave: false   ,
    saveUninitialized: false
}))
app.use(function(req,res,next){
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error") 
    res.locals.success = req.flash("success") 
    next()
}) 

app.set('view engine','ejs');




app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//follow sequence below
app.use(express.static(__dirname+"/public"))
app.use(methodOverride("_method"));
app.use(indexRoutes)

app.use("/campgrounds",campgroundRoutes)
app.use("/campgrounds/:id/comments",commentRoutes)

app.listen(3000,function(){
    console.log("hurrey");
})  