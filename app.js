var express         =  require("express"),
    app             =  express(),
    bodyParser      =  require("body-parser"),
    mongoose        =  require("mongoose"),
    passport        =  require("passport"),
    LocalStrategy   =  require("passport-local"),
    Campground      =  require("./models/campground"),
    Comment         =  require("./models/comment"),
    User            =  require("./models/user"),
    seedDB          =  require("./seeds");


//requiring routes
var commentRoutes   =  require("./routes/comments"),
    routesRoutes    =  require("./routes/routes"),
    indexRoutes     =  require("./routes/index");

mongoose.connect("mongodb://localhost:27017/climb_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// seedDB(); //Seed the database 

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
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", routesRoutes);


app.listen(3000, () => 
    console.log('Climb Camp App listening on port 3000')
);