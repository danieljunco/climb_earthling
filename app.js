var express         =  require("express"),
    app             =  express(),
    bodyParser      =  require("body-parser"),
    mongoose        =  require("mongoose"),
    passport        =  require("passport"),
    LocalStrategy   =  require("passport-local"),
    Campground      =  require("./models/campground"),
    Comment         =  require("./models/comment"),
    User            = require("./models/user"),
    seedDB          =  require("./seeds");


mongoose.connect("mongodb://localhost:27017/climb_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// ========================
// Passport Configuration 
// ========================

app.use(require("express-session")({
    secret: "links zwei drei vier",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

app.get("/", function(req, res) {
    res.render("landing");
});

// =================
// CAMP ROUTEs
// =================


app.get("/campgrounds", function(req, res){
    
    // Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("routes/index", {campgrounds:campgrounds});
        }
    })
});

app.get("/campgrounds/new", function(req, res){
    res.render("routes/new");
});

app.post("/campgrounds", function(req, res){
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

// SHOW Route

app.get("/campgrounds/:id", function(req, res){
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


// ======================
// COMMENTS ROUTES
// =====================

app.get("/campgrounds/:id/comments/new", isLoggedIn,function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        }else {
            res.render("comments/new", {campground: campground})
        }
    });
});

app.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){
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

//==============
// AUTH Routes
//==============

app.get("/register", function(req, res){
    res.render("register");
});
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        }); 
    });
});


app.get("/login", function(req,res){
    res.render("login");
});

app.post("/login", 
    passport.authenticate("local", { successRedirect: "/campgrounds",
                                     failureRedirect: "/login"
    }), function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, () => 
    console.log('Climb Camp App listening on port 3000')
);