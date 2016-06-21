var module = angular.module('taskPlanner', ['ui.router', 'ui.bootstrap', 'ui.layout']);

module.config(['$stateProvider', '$urlRouterProvider',
           /*function($routeProvider) {
               $routeProvider
                   .when('/register', {
                        templateUrl: 'routes/userForm/userForm.html',
                        controller: 'UserFormController',
                        requireLogin: false
                   })
                   .when('/tasks/view', {
                        templateUrl: 'routes/tasks/tasks.html',
                        controller: 'TasksController',
                        requireLogin: true
                   })
                   .when('/tasks/:id', {
                        templateUrl: 'routes/viewTask/viewTask.html',
                        controller: 'ViewTaskController',
                        requireLogin: true
                        })
                   .when('/:welcome?', {
                        templateUrl: 'routes/welcome/welcome.html',
                        controller: 'WelcomeController',
                        requireLogin: false
                   })
                   .otherwise({
                        redirectTo: '/'
                   });
           }])*/function($stateProvider, $urlRouterProvider){
                  $stateProvider
                    .state('register', {
                        url: "/register",
                        templateUrl: 'routes/userForm/userForm.html',
                        controller: 'UserFormController',
                        requireLogin: false
                    })
                    .state("tasksView", {
                      url: "/tasks/view",
                      templateUrl: 'routes/tasks/tasks.html',
                      controller: 'TasksController',
                      requireLogin: true
                    })
                    .state("taskView", {
                      url: "/tasks/:id",
                      templateUrl: 'routes/viewTask/viewTask.html',
                      controller: 'ViewTaskController',
                      requireLogin: true
                    })
                    .state("welcome", {
                      url: "/welcome",
                      templateUrl: 'routes/welcome/welcome.html',
                      controller: 'WelcomeController',
                      requireLogin: false
                    });
                  // Send to login if the URL was not found
                  $urlRouterProvider.otherwise("/welcome");
                }]).run(function($rootScope, $state, UserService){
                  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
                                if (toState.requireLogin){
                                UserService.isLoggedIn().then(null, function() {
                                    $state.transitionTo("welcome");
                                    event.preventDefault();
                                });
                                }
                              });

              });

