
module.controller("UserFormController", function($scope, $http, $location) {

	$scope.user = {};
	
	$scope.submitForm = function() {
	    delete $scope.user['password2'];
		  $http.post("/users", $scope.user)
		  .success(function(data) {
			  console.log("saved!");
			  $location.path("/");
		  });
	}
});

module.directive("matchTo", function() {
    return {
        require: "ngModel",
        scope: {
            otherValue: "=matchTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.matchTo = function(modelValue) {
                return modelValue == scope.otherValue;
            };
 
            scope.$watch("otherValue", function() {
                ngModel.$validate();
            });
        }
    };
});

module.directive('uniqueUser', function($http, $q) {
	  var timer;
	  return {
	    restrict: 'A',
	    require: 'ngModel',
	    link: function(scope, elem, attr, ngModel) {
	      ngModel.$asyncValidators.unique = function(modelValue, viewValue) {
		    	  var value = modelValue || viewValue;
		    	  
		    	  return $http.get('/checkUser?user=' + value).
		    	     then(function(response) {
		    	    	 	if (!response.data) {
		    	    	 		return $q.reject();
		    	    	 	}
		    	    	 	return true;
		    	     });
		    	 };
	    	}
	  }
	});

/*
module.directive('uniqueUser', function($http, $timeout) {
	  var timer;
	  return {
	    restrict: 'A',
	    require: 'ngModel',
	    link: function(scope, elem, attr, ctrl) { 
	      scope.$watch(attr.ngModel, function(value) {
	        if (timer) $timeout.cancel(timer);

	        timer = $timeout(function(){
	          $http.get('/checkUser?user=' + value).success(function(result) {
	              ctrl.$setValidity('unique', result);
	          });
	        }, 200);
	      })
	    }
	  }
	});
*/