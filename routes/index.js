var express  = require("express");
var router   = express.Router();
var passport = require("passport"),
    User     = require("../models/user");

router.get("/",function(req,res){
    res.render("landing")
    }
)
// show signin form
router.get("/register",function(req,res){
    res.render("register")
})
// handling signin
router.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error", "sign in failed.")
            // req.flash("error", err.message)

            return res.render("register")
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to Yelp Camp "+ user.username)
            res.redirect("/campgrounds")
        })
    })
})
// show login form
router.get("/login",function(req,res){
    res.render("login")
})

    
router.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }),function(req,res){

})

//logout
router.get("/logout",function(req,res){
    req.logOut()
    req.flash("success","logged you out")
    res.redirect("/campgrounds")
})


module.exports = router;