var doDebug = true;

var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser')

var mongodb = require('mongodb');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
	secret: 'angular_tutorial',
	resave: true,
    saveUninitialized: true,
}));


var port = 3000;
var uri = 'mongodb://skarnaukhov:Defad53a9067@ds017544.mlab.com:17544/sk-task-planner-db';

var collections = {};

console.log('Server start has been initiated...');

mongodb.MongoClient.connect(uri, function(err, db) {
  
  if(err) throw err;

  db.collection('tasks', function(error, tasks) {

    if (error) {
        throw new Exception(error);
    }

	 collections.tasks = tasks;
   });

   db.collection('users', function(error, users) {

       if (error) {
           throw new Exception(error);
       }

   	 collections.users = users;
      });

  if (doDebug) console.log('Connection to db has been established...');
});

/*----------TASKS----------------*/

app.get("/tasks", function(req,res) {
    if (doDebug) console.log('Task list requested...');
    collections.tasks.find({user: req.session.userName}).toArray(function(err, items) {
        if (doDebug) console.log('Found items size: ' + items.length);
		res.send(items);
	});
});

app.post("/tasks", function(req,res) {
    if (doDebug) console.log('Task add request');
    var task = req.body;
    task.user = req.session.userName;
    if (validateTask(task)) {
        collections.tasks.insert(task, function() {res.end();});
        if (doDebug) console.log('Task added successfully');
    } else {
        console.log('Task validation error');
        res.end();
    }

});

app.get("/task", function(req,res) {
    if (doDebug) console.log('Requested task with id: ' + req.query.id);
    var taskId = new mongodb.ObjectID(req.query.id);
    var task = collections.tasks.findOne({_id: taskId, user: req.session.userName}, function(err, task) {
        res.send(task ? task : false);
    });

});

app.post("/task", function(req,res) {
    if (doDebug) console.log('Attempty to add task');
    var task = req.body;
    if (validateTask(task)) {
        task['_id'] = new mongodb.ObjectID(task._id);
        collections.tasks.update({"_id" : task['_id'], user: req.session.userName}, {$set: task}, function(err) {if (err) console.log(err); res.end();});
    } else {
        console.log('Task validation error');
        res.end();
    }
});

app.delete("/task", function(req,res) {
    if (doDebug) console.log('Attempt to delete task with ID ' + req.query.id);
    var taskId = new mongodb.ObjectID(req.query.id);
    var task = collections.tasks.deleteOne({_id: taskId}, function(err, task) {
        res.end();
    });

});

var validateTask = function (task) {
    if (!task) {
        return false;
    }
    if (!task.name || task.name.length === 0) {
        return false;
    }
    if (task.priority !== parseInt(task.priority, 10) || task.priority < 1 || task.priority > 10) {
        return false;
    }
    return true;
};

/*-----------------------------------------------*/

app.get('/loggedIn', function(req,res){
    res.send(req.session.userName ? req.session.userName : false);
});

app.post("/login", function(req,res) {
	collections.users.find(
		{userName:req.body.login, password:req.body.password})
		.toArray(function(err, items) {
		    if (items.length > 0) {
		        req.session.userName = items[0].userName;
                res.send(true);
		    } else {
		        res.send(false);
		    }
		});
});

app.get("/logout", function(req, res) {
	req.session.userName = null;
	res.end();
});

app.get("/checkUser", function(req,res) {
    collections.users.find({userName:req.query.user}).toArray(function(err, items) {
        res.send(items.length === 0);
    });
});

app.post("/users", function(req,res) {
	collections.users.insert(req.body, function(resp) {
		req.session.userName = req.body.userName;
		res.end();
	});
});

app.listen(port);

console.log('Server has been started on port ' + port);
