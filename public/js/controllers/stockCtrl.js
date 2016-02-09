// public/js/controllers/stockCtrl.js

angular.module('StockCtrl', []).controller('StockController', function($scope, $http) {
	var selectedCompany = {};
	var selectedExchange = 'BSE';
	var selectedSymbolToMove = '';
	var destinationToMove = '';
	var previouosDestination = '';
	
	$scope.selectedList = 'holdings';

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
		$scope.getStocks($scope.selectedList);
	});
	
	$('#move-to-modal').on('hide.bs.modal', function() {
		$('#move-' + $scope.selectedList).show();
		$("#move-" + destinationToMove).removeClass("active");
	});
	
	$scope.getStocks = function(activeList) {
		$scope.selectedList = activeList;
		$http.get('/stocks/' + selectedExchange + '/' + $scope.selectedList)
		.success(function(data) {
			$scope.stocks = data;
			
			if ($scope.selectedList === 'holdings') {
				$('.bought-action').addClass('hidden');
				$('.sold-action').removeClass('hidden');
			} else if ($scope.selectedList === 'watch-list') {
				$('.bought-action').removeClass('hidden');
				$('.sold-action').addClass('hidden');
			} else {
				$('.bought-action').addClass('hidden');
				$('.sold-action').addClass('hidden');
			}
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};
	
	// when landing on page get all stocks and show them
	$scope.getStocks($scope.selectedList);
	
	setInterval(function() {
		$scope.getStocks($scope.selectedList);
	}, 10000);
	
	// when submitting the add form, send data to the Node API
	$scope.addStock = function() {
		var stockData = {
				"exchange": selectedCompany.exchDisp,
				"symbol": selectedCompany.symbol,
				"list_id": $scope.selectedList,
				"selectedExchange": selectedExchange
		};

		$http.post('/stocks', stockData)
			.success(function(data) {
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
		$http.delete('/stocks/' + symbol + '/' + selectedExchange + '/' + $scope.selectedList)
			.success(function(data) {
				$scope.stocks = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	$scope.openMoveToDialog = function(symbol) {
		selectedSymbolToMove = symbol;
		$('#move-to-modal').modal('show');
		$('#move-' + $scope.selectedList).hide();
	};
	
	$scope.setDestination = function(list_id) {
		previouosDestination = destinationToMove;
		
		if (previouosDestination !== '') {
			$("#move-" + previouosDestination).removeClass("active");
		}
		
		destinationToMove = list_id;
		$("#move-" + destinationToMove).addClass("active");
	};
	
	$scope.moveStock = function(action, symbol) {
		$('#move-to-modal').modal('hide');
		
		var stockData = {
				"symbol": symbol || selectedSymbolToMove,
				"selectedExchange": selectedExchange,
				"source": $scope.selectedList
		};
		
		switch (action) {
		case 'move':
			stockData.destination = destinationToMove;
			break;
		case 'bought':
			stockData.destination = 'holdings';
			break;
		case 'sold':
			stockData.destination = 'past-holdings';
			break;
		}
		
		$http.post('/stocks/move', stockData)
			.success(function(data) {
				selectedSymbolToMove = '';
				destinationToMove = '';
				$scope.stocks = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
});