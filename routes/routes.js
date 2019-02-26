var express         = require("express");
var router          = express.Router();
var Campground      = require("../models/campground");

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
router.get("/new", function(req, res){
    res.render("routes/new");
});

//CREATE - add new campground to DB
router.post("/", function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
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
        if(err){
            console.log(err);
        }
        else{
            //render show template with that campground
            res.render("routes/show",{campground: foundCampground});
        }
    });
});

module.exports = router;