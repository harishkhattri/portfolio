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
	$scope.deleteList = function(name) {
		$http.delete('/lists/' + name)
			.success(function(data) {
				$scope.lists = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
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
	};
});