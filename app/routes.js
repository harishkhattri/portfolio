// app/routes.js
// Defines various routes for server and front end

var Stocks = require("./models/stocks");

var getAllStocks = function(response) {
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
		getAllStocks(response);
	});
	
	// create stock and send back all stocks after creation
	app.post('api/stocks', function(request, response) {
		Stocks.findOne({isin: request.body.isin}, function(error, stock) {
			if (error) {
				response.send(error);
			}
			
			if (stock) {
				Stocks.update({symbol: request.body.symbol},
						{$addToSet: {lists: request.body.list_name}},
						function(error, stock) {
							if (error) {
								response.send(error);
							}
							
							getAllStocks(response);
						});
			} else {
				Stocks.create({
					exchange: request.body.exchange,
					symbol: request.body.symbol || '',
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
		Stock.remove({symbol: request.params.symbol}, function(error, stock) {
			if (error) {
				response.send(error);
			}
			
			getAllStocks();
		});
	});
	
	// Frontend routes
	app.get('/', function(request, response) {
		var options = {
				root: "./public"
		};
		response.sendFile('index.html', options);
	});
};