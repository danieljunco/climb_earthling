var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkRouteOwnerShip = function (req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundRoute){
            if(err || !foundRoute){
                req.flash("error", "Route not found");
                res.redirect("back");
            } else{
                //does userr own the route
                if((foundRoute.author.id.equals(req.user._id)) || (req.user && req.user.isAdmin)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to logged in");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnerShip = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else{
                //does user own the comment
                if((foundComment.author.id.equals(req.user._id)) || (req.user && req.user.isAdmin)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to logged in");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "Please Login"); 
        res.redirect("/login");
    }
}

module.exports = middlewareObj;