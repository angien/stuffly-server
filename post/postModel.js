var mongoose = require('mongoose');
var schema = mongoose.Schema;
var currDate = Date.now();

var userModel = require('../user/userModel');
// var locationModel = require('../location/locationModel');
// var categoryModel = require('../category/categoryModel');
var offerModel = require('../offer/offerModel');

var postSchema = new schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  price: Number,
  category: String,
  location: String,
  // categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  // location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  offers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }],
  condition: String,
  created: { type: Date, default: currDate },
  updated: { type: Date, default: currDate },
  imageUrl: String,
  obo: String
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
  var offerIds = this.offers;
  var thisPostId = this._id;

  // Pull post from the user that this post belongs to
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

  // // Pull posts from location that this post belongs to
  // locationModel.findByIdAndUpdate(
  //   locationId,
  //   { $pull: { 'posts': thisPostId } },
  //   { safe: true },
  //   function(err, model) {
  //     if(err) {
  //       next(new Error("Could not remove post id from posts array in location"));
  //     }
  //   }
  // );

  // // Pull posts from categories that this post belongs to
  // for(var idx = 0; idx < categoryIds.length; ++idx) {
  //   categoryModel.findByIdAndUpdate(
  //     categoryIds[idx],
  //     { $pull: { 'posts': thisPostId } },
  //     { safe: true },
  //     function(err, model) {
  //       if(err) {
  //         next(new Error("Could not remove post id from posts array in category"));
  //       }
  //     }
  //   );
  // }

  // Delete offers for this post
  for(var idx = 0; idx < offerIds.length; ++idx) {
    offerModel.findByIdAndRemove(offerIds[idx], function(err, model) {
      if(err) {
        console.log(err);
      }
    });
  }

  next();
});

module.exports = mongoose.model('Post', postSchema);