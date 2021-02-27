var express    = require("express");
var router     = express.Router({mergeParams:true});
var Campground = require("../models/campground"),
    Comment    = require("../models/comment");
var middleware = require("../middleware");
// form for new comment
router.get("/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err)
        }
        else{
            res.render("comments/new",{campground:campground})
        }
    })
    
})
//logic for new cooment
router.post("/",middleware.isLoggedIn,function(req,res){
    //lookup campground
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err)
        }
        else{
            console.log(req.body.comment)
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Something went wrong.")

                    console.log(err)
                }
                else{
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    req.flash("success","New comment added.")

                    res.redirect("/campgrounds/"+campground._id)
                }
            })
        }
    })
    
    
})
// edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
    Campground.findById(req.params.id,(err,foundCampfround)=>{
        if(err|| !foundCampfround){
            req.flash("error","Campground not found.")
            return res.redirect("back")
        }

        Comment.findById(req.params.comment_id,(err,foundComment)=>{
            if(err || !foundComment){
                req.flash("error","Comment not found")
                res.redirect("back")
            }
            else {
               
                res.render("comments/edit",{campground_id:req.params.id,comment:foundComment})
            }
        })
    })
    
    
})
// update route
router.put("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment)=>{
        if(err){
            res.redirect("back")
        }
        else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})
// delete comment
router.delete("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
        if(err){
            res.redirect("back")
        }
        else{
            req.flash("success","Comment deleted.")

            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

module.exports = router;