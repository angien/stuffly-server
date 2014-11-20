var mongoose = require('mongoose');
var schema = mongoose.Schema;

var categorySchema = new schema({
  name: String,
  description: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

module.exports = mongoose.model('Category', categorySchema);