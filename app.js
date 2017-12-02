var express = require('express');
var http = require('http');
var socketio = require('socket.io');

// create the servers
var app = express();
var server = http.Server(app);
var io = socketio(server);

// set port from the environment or fall back
app.set('port', (process.env.PORT || 3000));
// route to static files
app.use(express.static(__dirname + '/public'));

var num_clients = 0;

io.on('connection', function(socket) {
    io.emit('num_clients', ++num_clients);

    socket.on('line', function(data) {
        socket.broadcast.emit('line', data);
    });

    socket.on('clear', function () {
        socket.broadcast.emit('clear');
    });

    socket.on('disconnect', function(data) {
        io.emit('num_clients', --num_clients);
    });
});

// listen
server.listen(app.get('port'), function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('listening at http://%s:%s', host, port);
});
