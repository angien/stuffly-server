var userModel = require('./userModel'); 

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
    'email' : req.body.email
  };

  var newUser = new userModel(newUserInfo);
  userModel.create(newUser, next); 

  // Mongoose's create() sets "next" to create()'s callback, which is function(err, createdDoc)
  // when this function finishes, "createdDoc" in Router is then set to "next" 
  // this Create in CRUD is in Controller instead of Model because Mongoose has already wrapped the raw 
  // query as this create() function 
};

exports.updateOneUser = function(req, res, next) {
  req.userDoc.firstname = req.body.firstname;
  req.userDoc.lastname = req.body.lastname;
  req.userDoc.email = req.body.email;
  req.userDoc.save(next);
};

exports.deleteOneUser = function(req, res, next) {
  req.userDoc.remove(next);
};