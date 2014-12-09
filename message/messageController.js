var messageModel = require('./messageModel');

exports.getAllMessages = function(req, res, next) {
  messageModel.find(next);
};

exports.getOneMessage = function(req, res, next) {
  messageModel.findById(req.messageId, next);
};

exports.createOneMessage = function(req, res, next) {
  var newMessageInfo = {
    'to_id' : req.body.to_id,
    'from_id' : req.body.from_id,
    'message' : req.body.message
  };

  var newMessage = new messageModel(newMessageInfo);
  messageModel.create(newMessage, next);
};

exports.updateOneMessage = function(req, res, next) {
  // You can't update who sent the message and to whom the message was sent
  req.messageDoc.message = req.body.message;
  req.messageDoc.replied = true;

  req.messageDoc.save(next);
};

exports.deleteOneMessage = function(req, res, next) {
  req.messageDoc.remove(next);
};