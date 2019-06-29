var express       = require("express");
var app           = express();
var bodyParser    = require("body-parser");
var mongoose      = require("mongoose");
var passport      = require("passport");
var flash         = require("connect-flash");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground    = require("./models/campground");
var Comment       = require("./models/comment");
var User          = require("./models/user");
var seedDB        = require("./seeds");

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

mongoose.connect('mongodb+srv://devlovess:devlovesswalapass@cluster0-zd6xq.mongodb.net/test?retryWrites=true&w=majority'
, { 
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("Conected");
});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();

// ---------------------------PASSPORT CONFIG----------------------------------

app.use(require("express-session")({
    secret: "Hello there bitch",
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
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

// ----------------------------------------------------------------------------

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has started");
});