// app/routes.js
// Defines various routes for server and front end

var Stocks = require("./models/stocks");
var Lists = require("./models/lists")
var request = require("request");

var getStocks = function(response, exchange, list_id) {
	var selectedExchange = exchange;
	
	if (exchange === 'BSE') {
		selectedExchange = 'Bombay';
	}
	
	// get all stocks in the database
	Stocks.find({exchange: selectedExchange, lists: list_id},function(error, stocks) {
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

var getLists = function(response) {
	// get all stocks in the database
	Lists.find({}, function(error, lists) {
		if (error) {
			response.send(error);
		}
		
		response.json(lists);
	});
};

module.exports = function(app) {
	// Server routes
	app.get('/favicon.ico', function(request, response) {
		response.writeHead(200, {'Content-Type': 'image/x-icon'} );
		response.end();
	});
	
	// get all stocks
	app.get('/stocks/:exchange/:list_id', function(request, response) {
		getStocks(response, request.params.exchange, request.params.list_id);
	});
	
	// create stock and send back all stocks after creation
	app.post('/stocks', function(request, response) {
		Stocks.findOne({symbol: request.body.symbol}, function(error, stock) {
			if (error) {
				response.send(error);
			}
			
			if (stock) {
				Stocks.update({symbol: request.body.symbol},
						{$addToSet: {lists: request.body.list_id}},
						function(error, stock) {
							if (error) {
								response.send(error);
							}
							
							getStocks(response, request.body.selectedExchange, request.body.list_id);
						});
			} else {
				Stocks.create({
					exchange: request.body.exchange,
					symbol: request.body.symbol,
					lists: [ request.body.list_id ]
				}, function(error, stock) {
					if (error) {
						response.send(error);
					}
					
					getStocks(response, request.body.selectedExchange, request.body.list_id);
				});
			}
		});
	});
	
	// move stock from one list to another and send back all stocks for source list
	app.post('/stocks/move', function(request, response) {
		Stocks.update({symbol: request.body.symbol},
				{$addToSet: {lists: request.body.destination}},
				function(error, stock) {
					if (error) {
						response.send(error);
					}
					
					Stocks.update({symbol: request.body.symbol},
							{$pull: {lists: request.body.source}},
							function(error, stock) {
								if (error) {
									response.send(error);
								}
								
								getStocks(response, request.body.selectedExchange, request.body.source);
							});
				});
	});
	
	// delete a stock and send back all stocks after deletion
	app.delete('/stocks/:symbol/:exchange/:list_id', function(request, response) {
		Stocks.findOne({symbol: request.params.symbol, lists: request.params.list_id}, function(error, stock) {
			if (error) {
				response.send(error);
			}
			
			if (stock) {
				if (stock.lists.length > 1) {
					Stocks.update({symbol: request.params.symbol},
							{$pull: {lists: request.params.list_id}},
							function(error, stock) {
								if (error) {
									response.send(error);
								}
								
								getStocks(response, request.params.exchange, request.params.list_id);
							});
				} else {
					Stocks.remove({symbol: request.params.symbol}, function(error, stock) {
						if (error) {
							response.send(error);
						}
						
						getStocks(response, request.params.exchange, request.params.list_id);
					});
				}
			}
		});
	});
	
	// get all lists
	app.get('/lists', function(request, response) {
		getLists(response);
	});
	
	// create list if not exists and send back all lists after creation
	app.post('/lists', function(request, response) {
		Lists.findOne({name: request.body.name}, function(error, list) {
			if (error) {
				response.send(error);
			}

			if (!list && request.body.name) {
				var listId = request.body.name.toLowerCase().replace(/\s/g, '-');
				Lists.create({
					name: request.body.name,
					id: listId
				}, function(error, list) {
					if (error) {
						response.send(error);
					}
					
					getLists(response);
				});
			}
		});
	});
	
	// delete a list and send back all lists after deletion
	app.delete('/lists/:id', function(request, response) {
		Lists.remove({id: request.params.id}, function(error, list) {
			if (error) {
				response.send(error);
			}
			
			getLists(response);
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