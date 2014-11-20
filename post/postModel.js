var mongoose = require('mongoose');
var schema = mongoose.Schema;
var currDate = Date.now();

var userModel = require('../user/userModel');
var locationModel = require('../location/locationModel');
var categoryModel = require('../category/categoryModel');

var postSchema = new schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  price: Number,
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  condition: String,
  created: { type: Date, default: currDate },
  updated: { type: Date, default: currDate }
});

// Updates the 'updated' field to current time during every save
postSchema.pre('save', function(next) {
  this.updated = Date.now();

  if ( !this.created ) {
    this.created = this.updated;
  }
  next();
});

/*
  Removes this post's references from posts array in category, location, user document
  during every 'DELETE' request
 */
postSchema.pre('remove', function(next) {
  var userId = this.user;
  var locationId = this.location;
  var categoryIds = this.categories;
  var thisPostId = this._id;

  userModel.findByIdAndUpdate(
    userId,
    { $pull: { 'posts': thisPostId } },
    { safe: true },
    function(err, model) {
      if(err) {
        next(new Error("Could not remove post id from posts array in user"));
      }
    }
  );

  locationModel.findByIdAndUpdate(
    locationId,
    { $pull: { 'posts': thisPostId } },
    { safe: true },
    function(err, model) {
      if(err) {
        next(new Error("Could not remove post id from posts array in location"));
      }
    }
  );

  for(var idx = 0; idx < categoryIds.length; ++idx) {
    categoryModel.findByIdAndUpdate(
      categoryIds[idx],
      { $pull: { 'posts': thisPostId } },
      { safe: true },
      function(err, model) {
        if(err) {
          next(new Error("Could not remove post id from posts array in category"));
        }
      }
    );
  }

  next();
});

module.exports = mongoose.model('Post', postSchema);