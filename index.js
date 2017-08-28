let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/login', function(req, res){
    res.sendFile(__dirname + '/login.html');
});


app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
    console.log('a user connected');
    io.emit('chat connection');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

    socket.on('chat write_message', function(bool){
        console.log('write_message');
        io.emit('chat write_message', bool);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});