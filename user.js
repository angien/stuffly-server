var express = require('express');
var mongoose = require('mongoose');
var user = express.Router();

var userSchema = new mongoose.Schema(
{
    firstname: String,
    lastname : String,
    username: String
});

var User = mongoose.model('User', userSchema);

user.route('/')
    .post( function( req, res )
    {
        var username = req.body.username;
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;

        // var search = {"username": username};
        // User.findOne(search, function(err, doc)
        // {
        //     if(err)
        //     {
        //         res.status(204).send("no found");
        //     }

        //     else
        //     {
        //         res.status(202).send("yes found");
        //     }
        // });
        res.status(200).send("POST user");

    });

module.exports = user
