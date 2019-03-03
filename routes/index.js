var express     =   require("express");
var router      =   express.Router();
var passport    =   require("passport");
var User        =   require("../models/user");
var middleware      =   require("../middleware");

//ROOT route

router.get("/", function(req, res) {
    res.render("landing");
});

//==============
// AUTH Routes
//==============

// show register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});

// Handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register", {error: err.message});
        }
            passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome " + req.body.username);
            res.redirect("/campgrounds");
        }); 
    });
});

 //Show login form
router.get("/login", function(req,res){
    res.render("login", {page: 'login'});
});

//handling login logic
router.post("/login", 
    passport.authenticate("local", { successRedirect: "/campgrounds",
                                     failureRedirect: "/login"
    }), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged out");
    res.redirect("/campgrounds");
});

//USER profile
router.get("/users/:id/edit", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        res.render("users/show", {user: foundUser});
    });
});

router.put("/users/:id", middleware.isLoggedIn, function(req, res){
    console.log(req.params.id);
    User.update({_id:req.params.id}, {
        $set:{
            name: req.body.profile.name,
            city: req.body.profile.city,
            phone: req.body.profile.phone,
            email: req.body.profile.email,
            country: req.body.profile.country,
            alias: req.body.profile.alias
        }
    }, function(err){
        if(err){
            req.flash("error", "Check your data");
            res.redirect("back");
        }
        else{
            req.flash("success", "Personal Information Updated");
            res.redirect("/users/" + req.params.id + "/edit");
            console.log(req.params.id);
        }
    });
});


module.exports = router;