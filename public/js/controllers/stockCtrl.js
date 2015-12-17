// public/js/controllers/stockCtrl.js

angular.module('StockCtrl', []).controller('StockController', function($scope, $http) {
	$scope.formData = {'text': ''};
	$scope.companies = {};
	
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
						$scope.companies = data.ResultSet.Result;
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
	});
	
	// when landing on page get all stocks and show them
	$http.get('/api/stocks')
		.success(function(data) {
			$scope.stocks = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	
	// when submitting the add form, send data to the Node API
	$scope.addStock = function() {
		var stockData = {};
		$http.post('/api/stocks', stockData)
			.success(function(data) {
				$scope.formData = {};
				$scope.stocks = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	// delete a stock for given ISIN
	$scope.deleteStock = function(isin) {
		$http.delete('/api/stocks/' + isin)
			.success(function(data) {
				$scope.stocks = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
});