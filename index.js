// set up Express
var express = require('express');
var app = express();

// set up EJS
app.set('view engine', 'ejs');

// set up BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//setup cookie session
var cookieSession = require('cookie-session');
var session = require("express-session");
app.use(session({
    secret: "abcxyz", 
    resave: true,
    rolling: true,
    saveUninitialized: false,
}));

// import the Person class from Person.js
var Fooduser = require('./Fooduser.js');
var User = require('./User.js');
var Review = require('./Review.js');
var Comment = require('./Comment.js');
var async = require('async');
var mongoose = require('mongoose');
var mongodb = require('mongodb')
mongoose.connect('mongodb+srv://finalproject74:ih1aNyzzjG7FVI1S@cluster0-3rivj.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true , useUnifiedTopology: true 
});


var foodData = 'food'
/***********************START Update Profile Pic********************************************* */

var multer = require('multer');
var path = require('path')
var fs = require('fs')
var session = require('express-session')
var cookieParser = require('cookie-parser');

app.use('/public', express.static('public'));
app.use(cookieParser());
app.use(session({
	secret: "secretkey",
	resave: false,
	saveUninitialized: false,
}));

app.use('/public', express.static('public'));

var storage = multer.diskStorage({
	destination:function(req,file,cb){
		//error is null
		cb(null,'uploads')
	},
	
	filename:function(req,file,cb){
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
	}
	
}) 

var upload = multer({
	storage:storage
})


app.post('/uploadPhoto', upload.single('inputPhoto'), (req,res) => {
	console.log('this is the session user' + req.session.user)
	var photo = fs.readFileSync(req.file.path);
	//encode the image
	var encoded = photo.toString('base64')

	User.findOne( {username: req.session.user.name}, (err, user) => {
			if (err) {
				res.type('html').status(200);
				console.log('uh oh' + err);
				res.write(err);
			}
			else {
				if (!User) {
					res.type('html').status(200);
					res.write('Not a valid username or password');
					res.end();
					return;
				}
				else {
					//update user information
					var imageBuff = new Buffer(encoded, 'base64')
					user.contentType = req.file.mimetype
					user.path = req.file.path
					user.image = imageBuff
					user.save( (err) => { 
                    if (err) {
                        res.type('html').status(200);
                        res.write('uh oh: ' + err);
                        console.log(err);
                        res.end();
                    }
                    else {
					req.session.user = user	
					res.redirect('/homepage?username=' + user.username)
					//pass in the buffer
						
                    }
                    }); 
				}  
			}
			});
})

/***********************END Update Profile Pic********************************************* */
var MongoClient = mongodb.MongoClient;
var url = "mongodb+srv://bing13:1999911Bl@cluster0-3rivj.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(url, {
	useUnifiedTopology:true, useNewUrlParser:true
}, (err, client) => {
	if(err){ return console.log(err);
		console.log('there was an error')
	}
	
	db =client.db('test');
	
	app.listen(5000,  () => {
		console.log('Mongodb: Listening on port 5000');
		});
	
})

app.use('/addVeggie', (req, res) => {

	var username =  req.session.user.username
	var newFood = {
		foodName: req.body.foodName,
		number:req.body.number,
		units:req.body.units
	}

	//append new food to the array that is retrieved from datanbase 
	db.collection(foodData).findOne({ username: username}, (err, Fooduser) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
		    if (!Fooduser) {
				//res.json(ret);
			    res.type('html').status(200);
			    res.write('Not a valid username');
			    res.end();
			    return;
            }
            else {
			
		

				//need to add to existing array by appending newFood to it
				var retArr = Fooduser.veg
				retArr.push(newFood)

				Fooduser.veg = retArr

				db.collection(foodData).save(Fooduser, (err) => { 
                    if (err) {
                        res.type('html').status(200);
                        res.write('uh oh: ' + err);
                        console.log(err);
                        res.end();
                    }
                    else {
						console.log('updated user var')
						console.log(Fooduser)
                    }
                    });


            } 
		}
	})
	
})


/////////////////////////End Food Table/////////// Start Search ///////////////
app.use('/search', (req, res) => {
	var typeSearch = req.query.typeSearch
	req.session.typeSearch = typeSearch

	console.log('session type search first')
	console.log(req.session.typeSearch)
	//redirects to the search page

	//search through 
	console.log(req.session.user)
	res.render('test', {address: req.session.user.address, resultsArr: "", markerAddress: "",
zipcodeSearch:"", username: req.session.user.username})
})

app.use('/zipcodeSearch', (req, res) => { //change this into search by zipzcode
	

	var typeSearch = req.session.typeSearch
	var profileType = ""
	if (typeSearch == 'restaurant'){
		profileType='restaurant'
	} else {
		profileType='foodBank'
	}

	var zipcode = req.body.zipcode
	//returns the users that satifies this condition
	User.find({zipcode: zipcode, profileType: profileType}, (err, allUsers) => {
		if (err) {
			res.type('html').status(200);
			console.log('uh oh' + err);
			res.write(err);
		}
		else {
			if (allUsers.length == 0) {
				res.json( { 'status' : 'no people' } );
				
			}
			else {
				//make an array of the addresses to pass in 
				var addressArr = []
				for(var i = 0; i < allUsers.length; i++){
					var currUser = allUsers[i]
					addressArr.push(currUser.address)
				}

		

				res.render('test', {address:req.session.user.address, resultsArr: allUsers, markerAddress: addressArr,
				zipcodeSearch: zipcode, username: req.session.user.username})
				
			}
 
		}
		});

})

///////////////////////////////End Search///////////////////////////////////////



app.use('/loginmobile', (req, res) => {
	console.log("mobile login attempt")
	//find user from request body 
	var searchUserName = req.query.username
	var searchPassword = req.query.password
	var ret = [];
	User.findOne( {username: searchUserName, password: searchPassword}, (err, user) => {
		if (err) {
			res.type('html').status(200);
			console.log('uh oh' + err);
			res.write(err);
		}
		else {
			if (!user) {
				res.json(ret);
				//res.type('html').status(200);
				//res.write('Not a valid username or password');
				//res.end();
				//return;
			}
			else {
				ret.push(user);
				res.json(ret);
				//res.redirect('/homepage?username=' + user.username)
			}
			//redirect to user homepage and send user data   
		}
		});
});

/***************************************/
// route for logging in 
// this is the action of the "logging in" form
app.use('/login', (req, res) => {
	//find user from request body 
	if(req.body.username) {
		var searchUserName = req.body.username
		var searchPassword = req.body.password
		User.findOne( {username: searchUserName, password: searchPassword}, (err, user) => {
			if (err) {
				res.type('html').status(200);
				console.log('uh oh' + err);
				res.write(err);
			}
			else {
				if (!user) {
					//res.json(ret);
					console.log("invalid username/password")
					res.render('loginpage', {valid: false}); 
				}
				else {
					//ret.push(user);
					//res.json(ret);
					//redirect to user homepage and send user data 
					
					res.redirect('/homepage?username=' + user.username)
				}
			}
			});
	}
	else {
		console.log("not a user");
		res.write('Please enter a username/password');
		res.end();
		return;
	}
	//var ret = [];
	});
	

app.use('/mDelete', (req, res) => {
	var row = req.query.row
	console.log("This is the row to be deleted" + row)

	
})	


app.use('/homepage', (req,res) => {
    var login_username = req.query.username
    User.findOne( {username: login_username}, (err, user) => {
		//set the session user to the user
		req.session.user = user
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
		    if (!user) {
			    res.type('html').status(200);
			    res.write('Not a valid username or password');
			    res.end();
			    return;
            }
            else {

				db.collection(foodData).findOne( {username: login_username}, (err, foodInfo) =>{
					if(err) {
						return console.log(err);
					} else if (!foodInfo){
						res.type('html').status(200);
						res.write('Not a valid username or password');
						res.end();
						return;
						
					} else {

						
						
						if (user.contentType == undefined){
							res.render('newHomepage', {login_user: user, contentType: "", buff: ""}) 
						} else {
							res.render('newHomepage', {login_user: user, contentType: user.contentType, buff: user.image,
							veg: foodInfo.veg}) 
						}

						
					}

				})
				
            }  
		}
	    });
})

app.use('/createUser', (req, res) => {
	var body = req.body
	var inputaddress = body.line1+" "+body.line2+" "+ body.city+" "+body.state+ " " + body.zipcode;
	console.log('this is the profile type')
	console.log(req.body.profileType)

    var newUser = new User ({
		username: req.body.username,
        password: req.body.password,
		name: req.body.name,
		profileType: req.body.profileType,
		address: inputaddress,
		zipcode: req.body.zipcode

        });
	// save the person to the database
	newUser.save( (err) => { 
		if (err) {
		    res.type('html').status(200);
		    res.write('uh oh: ' + err);
		    console.log(err);
		    res.end();
		}
		else {
		    // display the "successfully created" page using EJS
		    res.render('created');
		}
		}); 
		

	//add new user to the second database
		var newFooduser = new Fooduser ({
		username: req.body.username,
		veg: [],
		nonperishables: [],
		meats: [],
		dair:[]
	})
		
		db.collection(foodData).insertOne(newFooduser, (err, result) =>{
		if(err) {
			return console.log(err);
		}
		
	})

    });

app.use('/editUser', (req,res) => {
    var login_username = req.query.username
    var changed_name = req.body.name
    var changed_password = req.body.password
    var changed_description = req.body.description
    var changed_contact_info = req.body.contact_info
	var changed_availability = req.body.food_availability
	var changed_pickup_date = req.body.pickup_date 
	var changed_pickup_time = req.body.pickup_time
    User.findOne( {username: login_username}, (err, user) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
		    if (!User) {
			    res.type('html').status(200);
			    res.write('Not a valid username or password');
			    res.end();
			    return;
            }
            else {
                if(changed_name){
                    user.name = changed_name
                }
                if(changed_password){
                    user.password = changed_password
                }
                if(changed_description){
                    user.description = changed_description
                }
                if(changed_contact_info){
                    user.contact_info = changed_contact_info
                }
                if(changed_availability){
                    user.food_availability = changed_availability
				}
				if(changed_pickup_date){
					user.pickup_date = changed_pickup_date
				}
				if(changed_pickup_time){
					user.pickup_time = changed_pickup_time
				}
                user.save( (err) => { 
                    if (err) {
                        res.type('html').status(200);
                        res.write('uh oh: ' + err);
                        console.log(err);
                        res.end();
                    }
                    else {
                        res.render('editUser', {login_user: user}) 
                    }
                    }); 
            }  
		}
	    });
})

app.use('/edit', (req,res) => {
    var login_username = req.query.username
    User.findOne( {username: login_username}, (err, user) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
		    if (!User) {
			    res.type('html').status(200);
			    res.write('Not a valid username or password');
			    res.end();
			    return;
            }
            else {
                res.render('editUser', {login_user: user}) 
            }  
		}
	    });
})

app.use('/deleteuser', (req, res) => {
	var login_username = req.query.username
	User.deleteOne( {username: login_username}, function(err, obj){
		if(err) {
			res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
			res.redirect('/')
		}
	})
})

app.use('/reviews/:username', (req, res)=> {
	var user = req.params.username;
	let tot = 0;
	async.waterfall([
		function(callback) {
			User.findOne({username: user}).populate({
				path: 'reviews',
				model: 'Review',
				populate: { path: 'comments', model: 'Comment'}
			  }).sort({date: 'descending'}).exec(function(err, user){
				if(err) console.log(err);
				else callback(null, user);
			})
		}], 
		function(err, results) {
			for(var i = 0; i < results.reviews.length; i++) {
				tot = tot + results.reviews[i].rating;
			}
			tot = tot / results.reviews.length;
			tot = Math.round(tot);
			res.render('review', {reviews: results.reviews, avg: tot, numreviews: results.reviews.length});
		}
	)
})
app.use('/addreview', (req, res)=>{
	var review = req.body.review;
	var rating = req.body.userrating;
	var author = req.session.user.name;
	var review = new Review({review, rating, author});
	review.save(function(err, result) {
		User.findOneAndUpdate({username: req.body.myreview},
	{
		"$push": { "reviews": review}
	},
	(err, result) => {
		if (err) {
			console.log(err); 
		}
		res.json({"Status": "OK"});
	});
})
})
app.use('/addcomment/:id', (req, res) =>{
	var reviewid = req.params.id;
	var comment = req.query.comment;
	var author = req.session.user.name;
	var c = new Comment({author, comment});
	c.save(function(err, result) {
            Review.findOneAndUpdate({_id: reviewid},
        {
            "$push": { "comments": c}
        },
        (err, result) => {
            if (err) {
                console.log(err); 
			}
			else {
				res.redirect('back');
			}
        });
	})
})
app.use('/create',(req,res) => {
    res.render('createpage')
})

app.use('/', (req,res) => {
	res.render('loginpage', {valid:true})
});
app.listen(3000,  () => {
	console.log('Listening on port 3000');
    });
