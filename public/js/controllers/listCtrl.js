// public/js/controllers/listCtrl.js

angular.module('ListCtrl', []).controller('ListController', function($scope, $http) {
	var previousActiveListId = '';
	var currentActiveListId = 'holdings';
	var currentActiveListName = 'Holdings';
	$scope.listData = {};
	
	$scope.getLists = function() {
		$http.get('/lists')
		.success(function(data) {
			$scope.lists = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};
	
	// when landing on page get all lists and show them
	$scope.getLists();
	
	// when submitting the add form, send data to the Node API
	$scope.createList = function() {
		$http.post('/lists', $scope.listData)
			.success(function(data) {
				$scope.listData = {};
				$scope.lists = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	// delete the selected list
	$scope.deleteList = function() {
		$('#remove-list-modal').modal('hide');

		$http.delete('/lists/' + currentActiveListName)
			.success(function(data) {
				$scope.lists = data;

				for (var i = 0; i < $scope.stocks.length; i++) {
					$scope.deleteStock($scope.stocks[i].symbol);
				}
				
				currentActiveListId = '';
				$scope.activate("Holdings", "holdings");
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	// show confirmation dialog when user delete a list
	$scope.confirmDelete = function() {
		$('#remove-list-modal').modal('show');
	};
	
	// Activate selected list item and deactivated previously selected list item
	$scope.activate = function(name, id) {
		previousActiveListId = currentActiveListId;
		
		if (previousActiveListId !== '') {
			$("#" + previousActiveListId).removeClass("active");
		}
		
		currentActiveListId = id;
		currentActiveListName = name;
		$("#" + currentActiveListId).addClass("active");
		
		$scope.getStocks(currentActiveListName);
	};
});