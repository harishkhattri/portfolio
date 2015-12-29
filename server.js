// server/server.js
// This is the main file of the backend

// include modules
var express = require('express');
var app = express();
var mongoose = require("mongoose");
var logger = require('morgan');
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

// configuration
var db = require("./config/db");
var port = process.env.PORT || 8080;

mongoose.connect(db.url);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({type: "application/vnd.api+json"}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

// routes
require("./app/routes")(app);

// start app
app.listen(port);

exports = module.exports = app;