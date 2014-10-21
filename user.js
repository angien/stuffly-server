var express = require('express');
//var bodyParser  = require('body-parser');

var user = express.Router();

user.route('/')
   /*
    *   Request when APP is open
    */
    .post( function( req, res )
    {
        console.log(req.body.username);
        res.json(
            {
                user : "ryan"
            });

    });

module.exports = user
