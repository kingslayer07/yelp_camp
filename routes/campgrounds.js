var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")//agar index.js k alawa koi file hoti toh naam mention krna pdta 
// INDEX --  display a list of campgronds
router.get("/",function(req,res){
    
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err)
        }
        else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser:req.user})
        }
    })
    
    }
)
// CREATE -- create new campgrounds
router.post("/",middleware.isLoggedIn,function(req,res){
    
    var name=req.body.name
    var image=req.body.image
    var price= req.body.price
    var desc = req.body.description
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newCampground={name:name,image:image,price:price,description:desc,author : author}

    console.log(author)
    Campground.create(newCampground,function(err , newlyCreated){
        if(err){
            console.log(err)
        }
        else {
            console.log(newlyCreated)
         res.redirect("/campgrounds") } 
    })
    
})
// NEW -- show form to create new campgrounds
router.get("/new",middleware.isLoggedIn,(req,res)=>{
    res.render("campgrounds/new")
})

// SHOW -- show more about  single campground 
router.get("/:id",function(req,res){
    
    
    // find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err || !foundCampground){
            req.flash("error","Something went wrong.")
            res.redirect("back")
        }
        else{
            // console.log(foundCampground)
            // console.log(req)
            //render show template with that campground
            res.render("campgrounds/show",{currentUser:req.user,campground:foundCampground})
        }
    })
    
})
// edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
    // is user logged in 
    
    // if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                console.log(err)
            }
            else{
                // does user own the campground
                // if(foundCampground.author.id.equals(req.user._id)){
                    res.render("campgrounds/edit", {campground: foundCampground})
                }
                // else
                //     res.send("you cant edit this campground")                
    
            })
        
    
        
    

})
// update campground route
router.put("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
    // find and update correct camp
    
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
    // redirect to updated camp
})
//Delete Route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds")
        }
        else{
            res.redirect("/campgrounds")
        }
    })
})

module.exports = router;