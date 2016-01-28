// public/js/controllers/stockCtrl.js

angular.module('StockCtrl', []).controller('StockController', function($scope, $http) {
	var selectedCompany = {};
	var selectedExchange = 'BSE';
	var selectedList = 'Holdings';

	$('input.typeahead').typeahead({
		hint: true,
		highlight: true,
		minLength: 2
	}, {
		async: true,
		name: 'companies',
		display: function(data) {
			return data.name + "\t\t" + data.typeDisp + "-" + data.exchDisp;
		},
		source: function(query, syncResults, asyncResults) {
			var searchCompanyUrl = "https://s.yimg.com/aq/autoc?query=" + query + "&region=US&lang=en-US";
			$http.get(searchCompanyUrl)
					.success(function(data) {
						return asyncResults(data.ResultSet.Result);
					})
					.error(function(data) {
						console.log('Error: ' + data);
					});
		},
		templates: {
			suggestion: function(data) {
				var companyName = data.name.toUpperCase();
				
				if (companyName.length > 45) {
					companyName = companyName.substr(0, 45) + '...';
				}
				
				return "<p><span class='company-symbol'>" + data.symbol +
					"</span><span class='company-name'>" + companyName +
					"</span><span class='company-type'>" + data.typeDisp + "-" +
					data.exchDisp + "</span></p>";
			}
		}
	}).on("typeahead:selected", function(object, datum) {
		selectedCompany = datum;
	});
	
	$('#exchange').on('change', function(event) {
		selectedExchange = $('#exchange').val();
		$scope.getStocks(selectedList);
	});
	
	$scope.getStocks = function(activeList) {
		selectedList = activeList;
		$http.get('/stocks/' + selectedExchange + '/' + selectedList)
		.success(function(data) {
			$scope.stocks = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};
	
	// when landing on page get all stocks and show them
	$scope.getStocks(selectedList);
	
	setInterval(function() {
		$scope.getStocks(selectedList);
	}, 5000);
	
	// when submitting the add form, send data to the Node API
	$scope.addStock = function() {
		var stockData = {
				"exchange": selectedCompany.exchDisp,
				"symbol": selectedCompany.symbol,
				"list_name": selectedList,
				"selectedExchange": selectedExchange
		};

		$http.post('/stocks', stockData)
			.success(function(data) {
				$scope.formData = {};
				selectedCompany = {};
				$scope.stocks = data;
				$('input.typeahead').val("");
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	// delete a stock for given symbol
	$scope.deleteStock = function(symbol) {
		$http.delete('/stocks/' + symbol + '/' + selectedExchange + '/' + selectedList)
			.success(function(data) {
				$scope.stocks = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
});