var socket_io = require('socket.io');
var http = require('http');
var express = require('express');
var app = express();

app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var users = [];

io.on('connection', function(socket) {
	console.log('Client connected.');

	socket.on('message', function(message) {
		console.log('Received message: ', message);
		socket.broadcast.emit('message', message);
	});

	socket.on('login', function(user) {
		users.push(user);

		socket.emit('get users', users);

		console.log(user + ' just logged in');
		var loginMessage = user + ' just logged in';
		socket.broadcast.emit('message', loginMessage);
		socket.broadcast.emit('new user', user);
		
		socket.on('disconnect', function() {
			users = users.filter(function(name) {
				return name !== user;
			});
			var disconnectMessage = user + ' just logged out.';
			socket.broadcast.emit('message', disconnectMessage);
			socket.broadcast.emit('get users', users);
		});
	});
});

server.listen(process.env.PORT || 8080);