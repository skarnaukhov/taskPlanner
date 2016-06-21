module.factory("UserService", function($http, $rootScope, $timeout, $q) {
	var service = {};
	service.userName = "";
	service.loggedIn = false;

	service.isLoggedIn = function() {
	    var deferred = $q.defer();
	    if (service.loggedIn) {
	        deferred.resolve();
	    } else {
	        $http.get("/loggedIn", {})
                    			.success(function(res) {
                    				if (res !== false) {
                    				    service.loggedIn = true;
                    				    service.userName = res;
                    				    deferred.resolve();
                    				} else {
                                        service.loggedIn = false;
                                        deferred.reject();
                    				}
                    			});
	    }
        return deferred.promise;
	}
	
	service.login = function(login, password) {
		var deferred = $q.defer();
		$http.post("/login", {login:login, password:password})
			.success(function(res) {
				if (res) {
					service.loggedIn = true;
					service.userName = login;
					deferred.resolve("logged in");
				} else {
					service.loggedIn = false;
					service.userName = null;
					deferred.reject("wrong username/password");
				}
			});	
		return deferred.promise;
	}
	
	service.logout = function() {
		return $http.get("/logout");
	}
	
	return service;
});