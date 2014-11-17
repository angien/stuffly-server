var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
  firstname: String,
  lastname : String,
  email: String
});

// static method example: userSchema.statics.uhiu = function(req, res, next)
// non-static methods ... use "this" to access object property

module.exports = mongoose.model('user', userSchema); 

// Collection name is buggy ... always lower case and adds a 's' to the end
