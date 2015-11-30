// public/js/controllers/stockCtrl.js

angular.module('StockCtrl', []).controller('StockController', function($scope, $http) {
	$scope.formData = {};
	
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