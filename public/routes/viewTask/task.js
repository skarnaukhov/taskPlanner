module.controller('ViewTaskController', function($scope, $http, $window, $stateParams, taskService, Task) {

    $scope.priorities = Task.priorities;

    $scope.task = taskService.getCurrentTask();
    if ($scope.task == null) {
        Task.get($stateParams.id).then(
            (task) => $scope.task = !!task ? task : null,
            () => console.log('Failed to get current task')
        );
    }

    var updateTask = function() {
        $scope.task.update().then(
            ()=>$window.history.back(),
            (message)=>console.log(message)
        );
    };

    var deleteTask = function() {
        $scope.task.remove().then(
            ()=>$window.history.back(),
            (message)=>console.log(message)
        );
    };

    $scope.updateTask = updateTask;
    $scope.deleteTask = deleteTask;

});