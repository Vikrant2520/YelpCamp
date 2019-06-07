var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campgrounds")
var Comment = require("./models/comment");
var User = require("./models/user");
var methodOverride= require("method-override");
var seedDB = require("./seeds")

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

mongoose.connect("mongodb://viki:Vikrant25@ds261716.mlab.com:61716/vikrant-yelp");




app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
 // seedDB(); //seed the databse

app.use(require("express-session")({
	secret: " Hi from IITR",
	resave: false,
	saveUninitialized: false
}))
app.use(methodOverride("_method"));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error= req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

app.use(indexRoutes); 
app.use(campgroundRoutes); 
app.use(commentRoutes); 



 // Campground.create(
 // 	{ name: "KheerGanga",
 // 	  image:"https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
 // 	  description: "It is the best campground so far!"
 // 	},
	// function(err,campground){
	// 	if(err){
	// 		console.log(err)
	// 	}
	// 	else{
	// 		console.log("New Campground Created");
	// 		console.log(campground);
	// 	}

	// });







app.listen(3000,function(){
	console.log("Server Started");

});