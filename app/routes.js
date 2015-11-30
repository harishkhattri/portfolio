// app/routes.js
// Defines various routes for server and front end

var Stocks = require("./models/stocks");

var getAllStocks = function() {
	// get all stocks in the database
	Stocks.find(function(error, stocks) {
		if (error) {
			response.send(error);
		}
		
		response.json(stocks);
	});
};

module.exports = function(app) {
	// Server routes
	// get all stocks
	app.get('/api/stocks', function(request, response) {
		getAllStocks();
	});
	
	// create stock and send back all stocks after creation
	app.post('api/stocks', function(request, response) {
		Stocks.findOne({isin: request.body.isin}, function(error, stock) {
			if (error) {
				response.send(error);
			}
			
			if (stock) {
				Stocks.update({isin: request.body.isin},
						{$addToSet: {lists: request.body.list_name}},
						function(error, stock) {
							if (error) {
								response.send(error);
							}
							
							getAllStocks();
						});
			} else {
				Stocks.create({
					isin: request.body.isin,
					bsecode: request.body.bsecode || '',
					nsesymbol: request.body.nsesymbol || '',
					lists: [ request.body.list_name ]
				}, function(error, stock) {
					if (error) {
						response.send(error);
					}
					
					getAllStocks();
				});
			}
		});
	});
	
	// delete a stock and send back all stocks after deletion
	app.delete('/api/stocks/:isin', function(request, response) {
		Stock.remove({isin: request.params.isin}, function(error, stock) {
			if (error) {
				response.send(error);
			}
			
			getAllStocks();
		});
	});
	
	// Frontend routes
	app.get('*', function(request, response) {
		var options = {
				root: "./public"
		};
		response.sendFile('index.html', options);
	});
};