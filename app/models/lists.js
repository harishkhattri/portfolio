// app/models/lists.js
// Defines lists model

var mongoose = require("mongoose");

module.exports = mongoose.model('Lists', {
	name: {type: String, default: ''}
});