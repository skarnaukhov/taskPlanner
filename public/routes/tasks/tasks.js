module.controller('TasksController', function($scope, $http, $location, taskService) {

    var update = function() {
        var params = {};
        $http.get("/tasks", params).success(function(tasks) {
            $scope.tasks = tasks;
        });
    }

	var addTask = function() {
		if ($scope.name.length==0) return;
		var task = {name: $scope.name, priority: 5};
		$http.post("/tasks", task).success(function() {
				$scope.name = "";
				update();
			});
	};
	var showTask = function (task) {
	    taskService.setCurrentTask(task);
        $location.path('tasks/' + task._id);
    }

    $scope.taskClass = function(task) {
        var taskClass = '';
        if (task.priority < 5) {
            taskClass += ' x-listed-task-low-priority';
        } else if (task.priority < 8) {
            taskClass += ' x-listed-task-average-priority';
        } else {
            taskClass += ' x-listed-task-high-priority';
        }
        return taskClass;
    }

    $scope.showTask = showTask;
	$scope.addTask = addTask;

	update();

});