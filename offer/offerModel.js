var mongoose = require('mongoose');
var schema = mongoose.Schema;

var postModel = require('../post/postModel');

var offerSchema = new schema({
  offeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  offeredTo : { type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
  price: Number,
});

/*
  Removes this offer's references from offers array in posts model
  during every 'DELETE' request
 */
// offerSchema.pre('remove', function(next) {
//   var offeredTo = this.offeredTo;
//   var thisOfferId = this._id;
//   console.log(postModel);
//   // Pull offer from the post that this offer belongs to
//   postModel.findByIdAndUpdate(
//     offeredTo,
//     { $pull: { 'offers': thisOfferId } },
//     { safe: true },
//     function(err, model) {
//       if(err) {
//         next(new Error("Could not remove offer id from offers array in post"));
//       }
//     }
//   );

//   next();
// });

module.exports = mongoose.model('Offer', offerSchema);