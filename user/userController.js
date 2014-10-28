
var userModel = require('./userModel'); 

exports.createOneUser = function(res, req, next)
{
	var newUserInfo = 
		{
			'firstname' :  req.body.firstname,
			'lastname' : req.body.lastname,
			'username' : req.body.username
		};

	var newUser = new userModel(newUserInfo);
	userModel.create(newUser, next); 

	// Mongoose's create() ... it sets "next" to create()'s callback, which is function(err, created_doc)
	// when this function finishes, "created_doc" in Router is then set to "next" 
	// this Create in CRUD is in Controller instead of Model because Mongoose has already wrapped the raw 
	// query as this create() function 
};