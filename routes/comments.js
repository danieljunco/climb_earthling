var express         =   require("express");
var router          =   express.Router({mergeParams:true});
var Campground      =   require("../models/campground"),
    Comment         =   require("../models/comment");
var middleware      =   require("../middleware");


//COMMENTS new
router.get("/new", middleware.isLoggedIn,function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        }else {
            res.render("comments/new", {campground: campground})
        }
    });
});

//COMMENTS create
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
        }else{
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save()
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect campground show page
                    req.flash("success", "Successfully added");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });  
});

//COMMENT EDIT Route
router.get("/:comment_id/edit", middleware.checkCommentOwnerShip, function(req, res){
    Campground.findById(req.params.id, function(err, foundRoute){
        if(err || !foundRoute){
            req.flash("error","No route found");
            return res.redirect("back");
        } 
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else{
                res.render("comments/edit", {route_id: req.params.id, comment: foundComment});
            }
        });
    });
});

router.put("/:comment_id", middleware.checkCommentOwnerShip, function(req, res){
    Campground.findById(req.params.id, function(err, foundRoute){
        if(err || !foundRoute){
            req.flash("error","No route found");
            return res.redirect("back");
        } 
        Comment.findOneAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
            if(err){
                res.redirect("back");
            } else{
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
});

//COMMENT DELETE Route

router.delete("/:comment_id", middleware.checkCommentOwnerShip, function(req, res){
    Comment.findOneAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            Campground.findOneAndUpdate(req.params.id,
                {
                    $pull: {
                        comments: req.params.comment_id
                    }
                }, function(err, route){
                if(err){
                    console.log(err);
                } else{
                    req.flash("success", "Comment deleted");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    })
});

module.exports = router;