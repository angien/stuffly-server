var offerModel = require('./offerModel');
var postModel = require('../post/postModel');

exports.getAllOffers = function(req, res, next) {
  offerModel.find(next);
};

exports.getOneOffer = function(req, res, next) {
  offerModel.findById(req.offerId, next);
};

exports.createOneOffer = function(req, res, next) {
  var newOfferInfo = {
    'offeredBy' : req.body.offeredBy,
    'offeredTo' : req.body.offeredTo,
    'price' : req.body.price
  };

  var newOffer = new offerModel(newOfferInfo);
  offerModel.create(newOffer, next);
};

exports.deleteOneOffer = function(req, res, next) {
  // Removing the offer document from the post model's offers array
  var offerId = req.offerDoc._id;
  // Finally, remove the offer
  req.offerDoc.remove(next);
};

// Find the user model given the user's id and then push the post id to user's posts array
exports.populatePostModelOffers = function(req, res) {
  var offerDoc = req.offerDoc;
  var thisOfferId = offerDoc._id;
  var offeredToId = offerDoc.offeredTo;

  // Insert into post's 'offers' array
  postModel.findByIdAndUpdate(
    offeredToId,
    { $push: { 'offers': thisOfferId } },
    { safe: true, upsert: true },
    function(err, model) {
      if(err) {
        console.log(err);
      }
    }
  );
};

exports.pullOfferFromPost = function(req, res) {
  var offerDoc = req.offerDoc;
  var thisOfferId = offerDoc._id;
  var offeredToId = offerDoc.offeredTo;

  postModel.findByIdAndUpdate(
    offeredToId,
    { $pull: { 'offers': thisOfferId } },
    { safe: true },
    function(err, model) {
      console.log(err);
    }
  );
};