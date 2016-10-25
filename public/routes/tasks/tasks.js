module.controller('TasksController', function($scope, $http, $location, taskService, Task) {

    $scope.tasksTree =[];

    var update = function() {
        var params = {};
        $http.get("/tasks", params).success(function(tasks) {
            $scope.tasks = [];
            $scope.tasksTree =[];
            tasks.forEach((task) => {
                $scope.tasks.push(new Task(task))
            });
        });
    }

	var addTask = function() {
		if (!$scope.name || $scope.name.length==0) return;
		var task = new Task({name: $scope.name, priority: 5});
		task.create().then(
		    () => {$scope.name = "";update()},
			(message) => console.log(message)
		);
	};
	var showTask = function (task) {
	    taskService.setCurrentTask(task);
        $location.path('tasks/' + task._id);
    };

    var clearSelection = function() {
        $scope.selectedNode.selected = false;
        $scope.selectedNode = null;
    }

    var addGoal = function() {

    }

    $scope.onlyTasksFilter = (task) => task.parent === null;

    $scope.showTask = showTask;
    $scope.clearSelection = clearSelection;
	$scope.addTask = addTask;
    $scope.addGoal = addGoal;

	update();

	$scope.$on('selection-changed', (e, node) => $scope.selectedNode = node);

	/*$scope.tasksTree =[{
        name: "Node 1",
            children: [{
                name: "Node 1.1",
                children:[
                    {name:"Node 1.1.1"},
                    {name: "Node 1.1.2"}]
            }]
        },{
            name: "Node 2",
            children: [
                {name: "Node 2.1"},
                {name: "Node 2.2"}
            ]
        }];*/

});