var mongoose = require('mongoose');
var schema = mongoose.Schema;

var locationSchema = new schema({
  name: String,
  description: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

module.exports = mongoose.model('Location', locationSchema);