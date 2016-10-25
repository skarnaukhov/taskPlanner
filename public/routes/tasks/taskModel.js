module.factory('Task', function($http, $q) {

    var children = [];
    var parent = null;
    var rootNode = null;

    var _Task = function(data, _parent){
        if (data) {
            this.setData(data);
        }
        parent = _parent;
    };

    //For tree structure
    angular.extend(_Task.prototype, {
        root: true,
        leaf: true,
        priority: 5,
        name: ''
    });

    _Task.prototype.setData = function (data) {
        angular.extend(this, data);
    };

    _Task.priorities = [1,2,3,4,5,6,7,8,9,10];

    _Task.get = function(id) {
        var deferred = $q.defer();
        $http.get("/task", {params: {id: id}}).then(
            (task)=>deferred.resolve(new _Task(task)),
            ()=>deferred.reject('Unable to load task with id: ' + id)
        );
        return deferred.promise;
    }

    _Task.prototype.update = function() {
        var deferred = $q.defer();
        $http.post("/task", this).then(()=>deferred.resolve(),()=>deferred.reject());

        return deferred.promise;
    }

    _Task.prototype.remove = function() {
        var deferred = $q.defer();
        $http.delete("/task", {params: {id: this._id}}).then(
            ()=>deferred.resolve(),
            ()=>deferred.reject()
        );

        return deferred.promise;
    }

    _Task.prototype.create = function() {
        var deferred = $q.defer();
        var _this = this;
        $http.post("/tasks", this).then(
            (task)=>deferred.resolve(new _Task(_this)),
            ()=>deferred.reject('Unable to load task with id: ' + id)
        );
        return deferred.promise;
    }

    _Task.prototype.hasChildren = function() {
        return this.children.length > 0;
    }

    _Task.prototype.getDisplayCss = function() {
        var taskClass = '';
        if (this.priority < 5) {
            taskClass += ' x-listed-task-low-priority';
        } else if (this.priority < 8) {
            taskClass += ' x-listed-task-average-priority';
        } else {
            taskClass += ' x-listed-task-high-priority';
        }
        return taskClass;
    }

    _Task.prototype.isNotFolder = () => this.parent == null;

    return _Task;
});