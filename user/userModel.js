var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
  firstname: String,
  lastname : String,
  email: String,
  password: String,
  imageUrl: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

module.exports = mongoose.model('User', userSchema);