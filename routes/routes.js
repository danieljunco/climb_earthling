var express         = require("express");
var router          = express.Router();
var Campground      = require("../models/campground"),
    Comment         = require("../models/comment");
var middleware       = require("../middleware");

// INDEX - show all campgrounds
router.get("/", function(req, res){
    
    // Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("routes/index", {campgrounds:campgrounds});
        }
    })
});

//NEW - show register form
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("routes/new");
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author:author};

    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });
});

// SHOW - show more info about one route

router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Route not found");
            res.redirect("back");
        } else{
            //render show template with that campground
            res.render("routes/show",{campground: foundCampground});
        }
    });
});

// EDIT Routes route
router.get("/:id/edit", middleware.checkRouteOwnerShip, function(req, res){
    Campground.findById(req.params.id, function(err, foundRoute){
        if(err || !foundRoute){
            req.flash("error","The route doesn`t exist");
            res.redirect("back"); 
        } else {
            res.render("routes/edit", {route: foundRoute});       
        }
    });
});

//UPDATE Routes route
router.put("/:id", middleware.checkRouteOwnerShip, function(req, res){
    //find and update the correct campground
    Campground.findOneAndUpdate(req.params.id, req.body.route, function(err, updatedRoute){
        if(err){
            res.redirect("/campgrounds");
        } else{
            //redirect somewhere 
            res.redirect("/campgrounds/" +req.params.id);
        }
    })
    
});

//DESTROY Route route
router.delete("/:id", middleware.checkRouteOwnerShip, function(req, res){
    Campground.findById(req.params.id, function(err, route){
        if(err || !route){
            req.flash("error","The route doesn`t exist");
            console.log(err);
        }
        else{
            route.remove();
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;