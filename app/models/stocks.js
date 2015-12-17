// app/models/stocks.js
// Defines stocks model

var mongoose = require("mongoose");

module.exports = mongoose.model('Stocks', {
	exchange: {type: String, default: ''},
	symbol: {type: String, default: ''},
	lists: {type: Array}
});