// all middleware goes here
var Campground            = require("../models/campground"),
    Comment               = require("../models/comment");
var middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
            Campground.findById(req.params.id,function(err,foundCampground){
                if(err || !foundCampground){
                    req.flash("error","Something went wrong")

                    res.redirect("back")
                }
                else{
                    // does user own the campground
                    if(foundCampground.author.id.equals(req.user._id)){
                         next()
                    }
                    else{
                        req.flash("error","Permission denied.")

                        res.redirect("back")    

                    }
                }
            })
        }
        else{
            req.flash("error","Authentication required.")

            res.redirect("back")
        }
}
middlewareObj.checkCommentOwnership = function(req,res,next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err || !foundComment){
                req.flash("error","Something went wrong.")

                res.redirect("back")
            }
            else{
                // does user own the comment
                if(foundComment.author.id.equals(req.user._id)){
                     next()
                }
                else
                    res.redirect("back")    
            }
        })
    }
    else{
        req.flash("error","You need to be logged in first")

        res.redirect("back")
    }
}
middlewareObj.isLoggedIn =function(req,res,next) {
    if(req.isAuthenticated()){
        return next()
    }
    else{
        req.flash("error","You need to be logged in first")
        res.redirect("/login")
    }
}   

module.exports= middlewareObj;