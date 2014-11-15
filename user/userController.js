
var userModel = require('./userModel'); 

exports.getAllUsers = function(req, res, next)
{
	userModel.find(next);
};

exports.getOneUser = function(req, res, next)
{
	userModel.findById(req.userid, next);
};

exports.createOneUser = function(req, res, next)
{
	var newUserInfo = 
		{
			'firstname' :  req.body.firstname,
			'lastname' : req.body.lastname,
			'email' : req.body.email
		};

	var newUser = new userModel(newUserInfo);
	userModel.create(newUser, next); 

	// Mongoose's create() ... it sets "next" to create()'s callback, which is function(err, created_doc)
	// when this function finishes, "created_doc" in Router is then set to "next" 
	// this Create in CRUD is in Controller instead of Model because Mongoose has already wrapped the raw 
	// query as this create() function 
};

exports.updateOneUser = function(req, res, next)
{
	req.user_doc.firstname = req.body.firstname;
	req.user_doc.lastname = req.body.lastname;
	req.user_doc.email = req.body.email;
	req.user_doc.save(next);
	console.log(req.user_doc);
};

exports.deleteOneUser = function(req, res, next)
{
	req.user_doc.remove(next);
};