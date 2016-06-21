module.controller("LoginController", function($scope, $timeout, $location, UserService) {
	
	$scope.loggedIn = UserService.loggedIn;
	
	$scope.logout = function() {
		UserService.logout().then(function() {
			$scope.loggedIn = false;
			UserService.loggedIn = false;
			$location.path("/");
		});
	}

	$scope.$watch(function(){
        return UserService.userName;
    }, function (newValue) {
        $scope.loggedIn = UserService.loggedIn;
        $scope.username = newValue;
    });
	
	$scope.login = function() {
		UserService.login($scope.username, $scope.password)
		.then(
			function(res) {
				$scope.loggedIn = true;
				$location.path("/tasks/view");
			},
			function(res) {
				$scope.wrongPassword = true;
				$timeout(function() {
					$scope.wrongPassword = false;
				}, 1000);
			}
		);
	}
	
});
