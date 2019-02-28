var express         =   require("express");
var router          =   express.Router({mergeParams:true});
var Campground      =   require("../models/campground"),
    Comment         =   require("../models/comment");


//COMMENTS new
router.get("/new", isLoggedIn,function(req, res){
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
router.post("/",isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
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
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });  
});

//COMMENT EDIT Route
router.get("/:comment_id/edit", function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else{
            res.render("comments/edit", {route_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comment_id", function(req, res){
    Comment.findOneAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//COMMENT DELETE Route

router.delete("/:comment_id", function(req, res){
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
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    })
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;