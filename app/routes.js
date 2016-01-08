// app/routes.js
// Defines various routes for server and front end

var Stocks = require("./models/stocks");
var request = require("request");

var getStocks = function(response, exchange) {
	var selectedExchange = exchange;
	
	if (exchange === 'BSE') {
		selectedExchange = 'Bombay';
	}
	
	console.log("Exchange: " + selectedExchange);
	
	// get all stocks in the database
	Stocks.find({exchange: selectedExchange},function(error, stocks) {
		if (error) {
			response.send(error);
		}
		
		var data = [];
		
		// Recursive function to handle asynchronous calls to http resquest
		var getStockData = function(i) {
			var url = "http://finance.yahoo.com/webservice/v1/symbols/" + stocks[i].symbol
				+ "/quote?format=json&view=detail";
			
			request(url, function(err, res, body) {
				if (err) {
					response.send(err);
				}
				
				var bodyData = JSON.parse(body).list.resources[0].resource.fields;
				
				var stockData = {
						"change": parseFloat(bodyData.change).toFixed(2),
						"day_high": parseFloat(bodyData.day_high).toFixed(2),
						"day_low": parseFloat(bodyData.day_low).toFixed(2),
						"name": bodyData.name,
						"price": parseFloat(bodyData.price).toFixed(2),
						"symbol": bodyData.symbol,
						"year_high": parseFloat(bodyData.year_high).toFixed(2),
						"year_low": parseFloat(bodyData.year_low).toFixed(2)
				};
				
				data.push(stockData);
				
				i++;
				
				if(i < stocks.length) {
					getStockData(i);
				} else {
					response.json(data);
				}
			});
		};
		
		if (stocks.length > 0) {
			getStockData(0);
		} else {
			response.json(data);
		}
	});
};

module.exports = function(app) {
	// Server routes
	app.get('/favicon.ico', function(request, response) {
		// do nothing
	});
	
	// get all stocks
	app.get('/stocks/:exchange', function(request, response) {
		getStocks(response, request.params.exchange);
	});
	
	// create stock and send back all stocks after creation
	app.post('/stocks', function(request, response) {
		Stocks.findOne({symbol: request.body.symbol}, function(error, stock) {
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
							
							getStocks(response, request.body.selectedExchange);
						});
			} else {
				Stocks.create({
					exchange: request.body.exchange,
					symbol: request.body.symbol,
					lists: [ request.body.list_name ]
				}, function(error, stock) {
					if (error) {
						response.send(error);
					}
					
					getStocks(response, request.body.selectedExchange);
				});
			}
		});
	});
	
	// delete a stock and send back all stocks after deletion
	app.delete('/stocks/:symbol/:exchange', function(request, response) {
		Stocks.remove({symbol: request.params.symbol}, function(error, stock) {
			if (error) {
				response.send(error);
			}
			
			getStocks(response, request.params.exchange);
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