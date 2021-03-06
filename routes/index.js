var express= require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campgrounds");

router.get("/",function(req,res){
	res.render("landing");
});

//Auth routes

router.get("/register",function(req,res){
	res.render("register");
})

router.post("/register",function(req,res){
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		avatar: req.body.avatar

	});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			
      return res.render("register", {"error": err.message});


		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to YelpCamp" + user.username);
			res.redirect("/campgrounds");
		});
	});
});

router.get("/login",function(req,res){
	res.render("login");
});

router.get("/users/:id",function(req,res){
	User.findById(req.params.id,function(err,foundUser){
		if(err){
			req.flash("error","Something went wrong!!");
			res.redirect("/");
		}
		else{
			Campground.find().where('author.id').equals(foundUser._id).exec(function(err,campgrounds){
				if(err){
					res.redirect("/");
				}
				else{
					res.render("users/show",{user:foundUser, campgrounds:campgrounds});
				}
			})
			
		}
	});

});






router.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}),function(req,res){

})

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out !!");
	res.redirect("/campgrounds");
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.flash("error","Please Login First!!");
	res.redirect("/login");


}
module.exports = router;

