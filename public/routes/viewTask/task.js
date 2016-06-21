module.controller('ViewTaskController', function($scope, $http, $window, $stateParams, taskService) {

    $scope.priorities = [1,2,3,4,5,6,7,8,9,10];

    var currentTask = taskService.getCurrentTask();
    if (currentTask == null) {
                $http.get("/task", {params: {id: $stateParams.id}}).success(function(task) {
                    if (task) {
                        $scope.task = task;
                    } else {
                        $scope.task = null;
                    }
                });
    } else {
        $scope.task = currentTask;
    }

    var updateTask = function() {
        $http.post("/task", $scope.task).success(function() {
    	    $window.history.back();
    	});
    };

    var deleteTask = function() {
        $http.delete("/task", {params: {id: $stateParams.id}}).success(function() {
            $window.history.back();
        });
    };

    $scope.updateTask = updateTask;
    $scope.deleteTask = deleteTask;

});