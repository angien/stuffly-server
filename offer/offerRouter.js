var express = require('express');
var offerRouter = express.Router();
var offerController = require('./offerController');

/*
  Parses the parameter :offerid in URL of form /api/offer/:offerid, then executes
  the original route function (next). Use the parsed id to query db for object
 */
offerRouter.param('offerid', function(req, res, next, id) {
  req.offerId = id;

  offerController.getOneOffer(req, res, function(err, offer) {
    if(err) {
      return next(err);
    }

    req.offerDoc = offer;
    return next();
  });
});

/*
  GET
  /api/offer
  Returns all offers
 */
offerRouter.route('/').get(function(req, res) {
  offerController.getAllOffers(req, res, function(err, offers) {
    if(err) {
      res.send("could not get all offers");
    } else {
      res.json(offers);
    }
  });
});

/*
  GET
  /api/offer/:offerid
  Returns one offer given the id
 */
offerRouter.route('/:offerid').get(function(req, res) {
  // Populate the posts array in the offer document
  req.offerDoc.populate('offeredBy offeredTo', function(err, offer) {
    res.json(offer);
  });
});

/*
  POST
  /api/offer
  Creates a new offer given an input body
 */
offerRouter.route('/').post(function(req, res) {
  offerController.createOneOffer(req, res, function(err, createdOffer) {
    if(err) {
      res.send("could not create offer");
    } else {
      req.offerDoc = createdOffer;
      offerController.populatePostModelOffers(req, res);

      res.json(createdOffer);
    }
  });
});

/*
  PUT
  /api/offer/:offerid
  Updates an existing offer given an input body
  NOTE: I REMOVED THIS ROUTE BECAUSE OFFERS SHOULD BE IMMUTABLE IN OUR APP
 */

/*
  DELETE
  /api/offer/:offerid
  Deletes a offer given the id
 */
offerRouter.route('/:offerid').delete(function(req, res) {

  offerController.deleteOneOffer(req, res, function(err, deletedOffer) {
    if(err)  {
      res.send("could not find offer to delete with id " + req.offerDoc._id);
    } else {
      offerController.pullOfferFromPost(req, res);
      res.json(deletedOffer);
    }
  });
});

module.exports = offerRouter;