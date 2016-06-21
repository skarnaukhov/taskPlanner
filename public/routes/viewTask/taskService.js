module.factory('taskService', function ($http) {

          var _currentTask = null;

          return {
              getCurrentTask: function () {
                  return _currentTask;
              },
              setCurrentTask: function (currentTask) {
                  _currentTask = currentTask;
              }
          };
      });