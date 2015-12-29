// public/js/appRoutes.js

angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider',
                                        function($routeProvider, $locationProvider) {
	$routeProvider
	
		// home page
		.when('/', {
			templateUrl: 'views/home.html'
		})
		
		// stocks page
		.when('/stocks', {
			templateUrl: 'views/stocks.html',
			controller: 'StockController'
		});
	
	$locationProvider.html5Mode(true);
}]);