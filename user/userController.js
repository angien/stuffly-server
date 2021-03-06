var userModel = require('./userModel');
var postModel = require('../post/postModel');
// var locationModel = require('../location/locationModel');
// var categoryModel = require('../category/categoryModel');
var offerModel = require('../offer/offerModel');
var messageModel = require('../message/messageModel');

exports.getAllUsers = function(req, res, next) {
  userModel.find(next);
};

exports.getOneUser = function(req, res, next) {
  userModel.findById(req.userId, next);
};

exports.createOneUser = function(req, res, next) {
  var newUserInfo = {
    'firstname' : req.body.firstname,
    'lastname' : req.body.lastname,
    'email' : req.body.email,
    'password' : req.body.password,
    'imageUrl' : req.body.imageUrl
  };

  // If the user is already created, then just return the user
  // Only create if the user if doesn't already exist in the DB
  userModel.findOne({ 'email': newUserInfo.email }, function(err, userDoc) {
    if(err || !userDoc) {
      var newUser = new userModel(newUserInfo);
      userModel.create(newUser, next);
    } else {
      // Return the already created user since it exists
      userDoc.statusCode = 409; // Duplicate user status code
      res.status(409).json(userDoc);
    }
  });

  // Mongoose's create() sets "next" to create()'s callback, which is function(err, createdDoc)
  // when this function finishes, "createdDoc" in Router is then set to "next"
  // this Create in CRUD is in Controller instead of Model because Mongoose has already wrapped the raw
  // query as this create() function
};

exports.loginOneUser = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  if(!email || !password) {
    res.send("Email or password incorrect");
    return;
  }

  // Check if email and password can find user in db
  userModel.findOne({ 'email': email, 'password': password }, function(err, userDoc) {
    if(err || !userDoc) {
      res.send("Email and password combo not found in db");
    } else {
      res.json(userDoc);
    }
  });
};

exports.updateOneUser = function(req, res, next) {
  req.userDoc.firstname = req.body.firstname;
  req.userDoc.lastname = req.body.lastname;
  req.userDoc.email = req.body.email;
  req.userDoc.password = req.body.password;
  req.userDoc.imageUrl = req.body.imageUrl;
  req.userDoc.save(next);
};

exports.deleteOneUser = function(req, res, next) {
  // Removing all posts associated with the user
  var userId = req.userDoc._id;

  // For each post, delete it from other models
  for(var idx = 0; idx < req.userDoc.posts.length; ++idx) {
    var currPostId = req.userDoc.posts[idx];

    // Get the post document
    postModel.findById(currPostId, function(err, currPost) {
      if(err) {
        console.log(err);
      }

      // var locationId = currPost.location;
      // var categoryIds = currPost.categories;

      // // Remove post id from location docs
      // locationModel.findByIdAndUpdate(
      //   locationId,
      //   { $pull: { 'posts': currPostId } },
      //   { safe: true },
      //   function(err, model) {
      //     if(err) {
      //       next(new Error("Could not remove post id from posts array in location"));
      //     }
      //   }
      // );

      // // Remove post id from all category docs
      // for(var idx = 0; idx < categoryIds.length; ++idx) {
      //   categoryModel.findByIdAndUpdate(
      //     categoryIds[idx],
      //     { $pull: { 'posts': currPostId } },
      //     { safe: true },
      //     function(err, model) {
      //       if(err) {
      //         next(new Error("Could not remove post id from posts array in category"));
      //       }
      //     }
      //   );
      // }
      // Remove the actual post
      currPost.remove(function(err) {
        if(err) {
          next(err);
        }
      });
    });
  }

  // Removing all offers associated with the user
  offerModel.find({ "offeredBy": userId }).remove().exec();

  // Finally, remove the user
  req.userDoc.remove(next);
};

exports.getUserOffers = function(req, res, next) {
  var userDoc = req.userDoc;
  var userId = userDoc._id;

  offerModel.find({ "offeredBy": userId }, next);
};

exports.getUserPosts = function(req, res, next) {
  var userDoc = req.userDoc;
  var userId = userDoc._id;

  postModel.find({ "user": userId }, next);
};

exports.getUserMessagesCreated = function(req, res, next) {
  var userDoc = req.userDoc;
  var userId = userDoc._id;

  messageModel.find({ "from_id": userId }, next);
};

exports.getUserMessagesReceived = function(req, res, next) {
  var userDoc = req.userDoc;
  var userId = userDoc._id;

  messageModel.find({ "to_id": userId }, next);
};

exports.getUserMessages = function(req, res, next) {
  var userDoc = req.userDoc;
  var userId = userDoc._id;

  messageModel.find( {
    $or: [{
      "from_id": userId
    }, {
      "to_id": userId
    }]
  }, next);
};