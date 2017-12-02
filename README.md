# Socket.io Painter

Online painter by using Socket.io, NodeJS, JS

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installing

* Create and navigate into working directory

* Install Express

```
$ npm install express --save
```

* Install Socket.io library

```
$ npm install socket.io --save
```

## Backend

* Import tools

```
var express = require('express');
var http = require('http');
var socketio = require('socket.io');

// create the servers
var app = express();
var server = http.Server(app);
var io = socketio(server);
```

* Socket handling

```
io.on('connection', function(socket) {
    io.emit('num_clients', ++num_clients);

    socket.on('line', function(data) {
        socket.broadcast.emit('line', data);
    });

    socket.on('disconnect', function(data) {
        io.emit('num_clients', --num_clients);
    });
});
```

### Frontend

* Initialize line

```
    /**
    * Init line
    * @param {Int}    Index of start
    * @param {Int}    Index of end
    * @param {Int}    Line size
    * @param {Int}    Color 
    */
    function line(start, end, size, color) {
        var oldSize = ctx.lineWidth;
        var oldColor = ctx.fillStyle;

        ctx.lineWidth = size;
        ctx.strokeStyle = color;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.closePath();

        ctx.lineWidth = oldSize;
        ctx.strokeStyle = oldColor;
    }
```

* Handle move event

```
    /**
     * Handle move of cursor and send through socket io
     * @param {Event} Event
     * */
    function handleMove(e) {
        var newPos = eventToXY(e);
        var data = {start: oldPos, end: newPos, size: size, color: color};
        socket.emit('line', data);
        line(oldPos, newPos, size, color);
        oldPos = newPos;
    };
```
* Move down event

```
    /**
     * Callback for start moving by press down gesture
     * @param {String} Gesture type
     * @param {Function} Callback handler
     * */
    canvas.addEventListener('mousedown', function(e) {
        if (e.which == 1) {
            handleStart(e);
        }
    });
```

* Move event

```
/**
     * Callback for start moving
     * @param {String} Gesture type
     * @param {Function} Callback handler
     * */
    canvas.addEventListener('mousemove', function(e) {
        if (e.buttons & 1) {
            handleMove(e);
        }
    });
```

* Socket's listener

```
/*
    * Fetch array of lines by socket io from NodeJS server
    * @params {String} Premitives
    * @param {Function} Callback handler
    * */
    socket.on('lines', function(data) {
        line(data.start, data.end, data.size, data.color);
    });

    socket.on('num_clients', function(data) {
        counter.innerHTML = data;
    });
```    
