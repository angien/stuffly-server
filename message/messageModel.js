var mongoose = require('mongoose');
var schema = mongoose.Schema;

var messageSchema = new schema({
  date: { type: Date, default: Date.now() },
  to_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  from_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String
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

module.exports = mongoose.model('Message', messageSchema);