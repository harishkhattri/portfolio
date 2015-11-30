// app/models/stocks.js
// Defines stocks model

var mongoose = require("mongoose");

module.exports = mongoose.model('Stocks', {
	isin: {type: String, default: ''},
	bsecode: {type: String, default: ''},
	nsesymbol: {type: String, default: ''},
	lists: {type: Array}
});