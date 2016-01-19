// public/js/controllers/listCtrl.js

angular.module('ListCtrl', []).controller('ListController', function($scope, $http) {
	$scope.listData = {};

	$scope.getLists = function() {
		$http.get('/lists')
		.success(function(data) {
			if (data.length === 0) {
				$('.list-group').hide();
			} else {
				$('.list-group').show();
				$scope.lists = data;
			}
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
});