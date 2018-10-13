var express = require('express');
var mongoDB = require('../mongoDB');
var ObjectId = require('mongodb').ObjectID;
var router = express.Router();
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: 'public/tmp/' });


// middlewares
function isAuthenticated(req, res, next) {
  if(req.cookies['loginCookie']){
    req.loggedin = true;
  } else {
    req.loggedin = false;
  }
  return next();
}

function getTimeStamp(req, res, next) {
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var hour = date.getHours();
  var min = date.getMinutes();
  req.time = day+"/"+month+"/"+year+" "+hour+":"+min;
  return next();
}

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next) {
  var DB = mongoDB.getDb();
  DB.collection('BlogList').find().limit(5).toArray(function(err, result){
    if(err) res.render('error', err);
    else res.render('index', {loggedin: req.loggedin, blogList: result});
  });
});

router.get('/blogList', isAuthenticated, function(req, res, next) {
  var DB = mongoDB.getDb();
  DB.collection('BlogList').find().toArray(function(err, result){
    if(err) res.render('error', err);
    else res.render('blogList', {title: 'Blogs List',loggedin: req.loggedin, blogList: result});
  });
});

router.post('/blogAdded', upload.single('image'), getTimeStamp, function(req, res, next) {
  var DB = mongoDB.getDb();
  var file = appRoot + '/public/uploads/' + req.file.filename +".png";
  fs.rename(req.file.path, file, function(err) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      req.body.image = req.file.filename+".png";
      req.body.time = req.time;
      DB.collection('BlogList').insertOne(req.body, function(err, result){
        if(err) res.render('error', err);
        else res.render('blogAdded', {message: "Blog Added Successfully." });
      });
    }
  });
});

router.get('/addBlog', isAuthenticated, function(req, res, next) {
  if(!req.loggedin){
    res.render('authError', {title: 'Blog Form' });
  } else {
    res.render('addBlog', {loggedin: req.loggedin, edit: false, data: "No data",title: 'Blog Form' });
  }
});

router.post('/addComment', isAuthenticated, function(req, res, next) {
  if(!req.loggedin){
    res.json({ status: -1, message: "User not loggedin, please login first." });
  } else {
    var DB = mongoDB.getDb();
    DB.collection('Comments').insertOne(req.body, function(err, result){
      if(err) res.json({status: -1, message: "DB error, contact site administrator."});
      else {
        res.json({status: 0, message: "Comment added against the blog."});
      }
    })
  }
});

router.get('/myBlogs', isAuthenticated, function(req, res, next) {
  var DB = mongoDB.getDb();
  var userID = req.cookies.loginCookie;
  DB.collection('BlogList').find({authorId: userID}).toArray(function(err, result){
    if(err) res.render('error', err);
    else res.render('blogList', {title: 'My Blogs',loggedin: req.loggedin, blogList: result});
  });
});

router.get('/adminBlogList', isAuthenticated, function(req, res, next) {
  var DB = mongoDB.getDb();
  DB.collection('BlogList').find().toArray(function(err, result){
    if(err) res.render('error', err);
    else res.render('adminBlogList', {loggedin: req.loggedin, list: result});
  });
});

router.get('/adminBlogList/:id/delete', isAuthenticated, function(req, res, next) {
  var DB = mongoDB.getDb();
  var blogID = ObjectId(req.params.id);
  DB.collection('BlogList').deleteOne({_id : blogID}, function(err, result){
    if(err) res.render('error', err);
    else {
      DB.collection('BlogList').find().toArray(function(err, result){
        if(err) res.render('error', err);
        else res.render('adminBlogList', {loggedin: req.loggedin, list: result});
      });
    }
  });
});

router.get('/adminBlogList/:id/blogEdit', isAuthenticated, function(req, res, next) {
  var dataToQuery = {
    "_id": ObjectId(req.params.id)
  };
  var DB = mongoDB.getDb();
  DB.collection('BlogList').find(dataToQuery).toArray(function(err, result){
    if(err) {
      res.render('error', err);
    }
    else {
      res.render('addBlog', {loggedin: req.loggedin, edit: true, data: result[0], title: 'Edit Blog' }); 
    }
  });

});

router.get('/blogDetail/:id', isAuthenticated, function(req, res, next) {
  var DB = mongoDB.getDb();
  var dataToQuery = {
    "_id": ObjectId(req.params.id)
  };
  DB.collection('BlogList').find(dataToQuery).toArray(function(err, result){
      if(err){
       res.render('error', err);
      } else{
        var dataToRender = result[0];
        var userID = req.cookies.loginCookie;
        if(dataToRender.authorId == userID){
          dataToRender.action = true;
        } else {
          dataToRender.action = false;
        }
        DB.collection('Comments').find({blogID: req.params.id}).toArray(function(err, result){
          if(err) {
            res.render('error', err); 
          } else {
            dataToRender.comments = result;
            res.render('blogDetail', {loggedin: req.loggedin, detail: dataToRender}); 
          }
        });
      }
  });
});

module.exports = router;
