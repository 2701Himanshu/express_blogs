var express = require('express');
var mongoDB = require('../mongoDB');
var ObjectId = require('mongodb').ObjectID;
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res, next) {
  	var DB = mongoDB.getDb();

  	DB.collection('Users').find({username: req.body.username}).toArray(function(err, result){ 
  		if(err) {
	  		res.json('error', err);	
	  	} else {
	  		if(result.length > 0){
	  			res.json({status: -1, message: "Username already registered. Please use another one."});
	  		} else {
	  			DB.collection('Users').find({email: req.body.email}).toArray(function(err, result){
				  	if(err) {
				  		res.json('error', err);	
				  	} else {
				  		if(result.length > 0){
				  			res.json({status: -1, message: "User already exist. Please change your email id."});
				  		} else {
				  			DB.collection('Users').insert(req.body, function(err, result){
								if(err) res.json('error', err);
								else res.json({status: 0, data: result});
							});
				  		}
				  	}
				});			
	  		}
	  	}
  	});
});

router.post('/login', function(req, res, next) { 
	var DB = mongoDB.getDb();
	DB.collection('Users').find({username: req.body.username}).toArray(function(err, result){ 
  		if(err) {
	  		res.json('error', err);	
	  	} else {
	  		if(result.length == 0){
	  			res.json({status: -1, message: "User not registered. Please registered first."});	
	  		} else {
	  			if(result[0].password != req.body.password){
	  				res.json({status: -1, message: "User's password not matched. Please contact administrator."});	
	  			} else {
	  				res.cookie('loginCookie', result[0]._id.toString(), { maxAge: 900000, httpOnly: true });
	  				res.json({status: 0, data: result});
	  			}
	  		}
	  	}
	});
});

router.get('/logout', function(req, res, next) { 
	res.clearCookie("loginCookie");
	res.json({status: 0});
});


module.exports = router;
