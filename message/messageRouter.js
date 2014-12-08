var express = require('express');
var messageRouter = express.Router();
var messageController = require('./messageController');

/*
  Parses the parameter :messageid in URL of form /api/message/:messageid, then executes
  the original route function (next). Use the parsed id to query db for object
 */
messageRouter.param('messageid', function(req, res, next, id) {
  req.messageId = id;

  messageController.getOneMessage(req, res, function(err, message) {
    if(err) {
      return next(err);
    }

    req.messageDoc = message;
    return next();
  });
});

/*
  GET
  /api/message
  Returns all messages
 */
messageRouter.route('/').get(function(req, res) {
  messageController.getAllMessages(req, res, function(err, messages) {
    if(err) {
      res.send("could not get all messages");
    } else {
      res.json(messages);
    }
  });
});

/*
  GET
  /api/message/:messageid
  Returns one message given the id
 */
messageRouter.route('/:messageid').get(function(req, res) {
  req.messageDoc.populate('to_id from_id', function(err, message) {
    res.json(message);
  });
});

/*
  POST
  /api/message
  Creates a new message given an input body
 */
messageRouter.route('/').post(function(req, res) {
  messageController.createOneMessage(req, res, function(err, createdMessage) {
    if(err) {
      res.send("could not create message");
    } else {
      req.messageDoc = createdMessage;

      res.json(createdMessage);
    }
  });
});

/*
  PUT
  /api/message/:messageid
  Updates an existing message given an input body
 */
messageRouter.route('/:messageid').put(function(req, res) {
  messageController.updateOneMessage(req, res, function(err, updatedMessage) {
    if(err) {
      res.send("could not update message with id " + req.messageDoc._id);
    } else {
      res.json(updatedMessage);
    }
  });
});

/*
  DELETE
  /api/message/:messageid
  Deletes a message given the id
 */
messageRouter.route('/:messageid').delete(function(req, res) {

  messageController.deleteOneMessage(req, res, function(err, deletedMessage) {
    if(err)  {
      res.send("could not find message to delete with id " + req.messageDoc._id);
    } else {
      res.json(deletedMessage);
    }
  });
});

module.exports = messageRouter;