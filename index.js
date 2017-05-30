var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var players = [];

app.set('port', (process.env.PORT || 8080));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index');
});

server.listen(app.get('port'), function(){
	console.log("Server is now running...", app.get('port'));
});

io.on('connection', function(socket){
	console.log("Player Connected!");
	socket.emit('socketID', { id: socket.id });
	socket.emit('getPlayers', players);
	socket.broadcast.emit('newPlayer', { id: socket.id });
	socket.on('playerMoved', function(data) {
	    data.id = socket.id;
	    socket.broadcast.emit('playerMoved', data);

	    for(var i = 0; i< players.length; i++) {
	        if(players[i].id == data.id) {
	            players[i].x == data.x;
	            players[i].y == data.y;
	        }
	    }
	});


	socket.on('disconnect', function(){
		console.log("Player Disconnected");
		socket.broadcast.emit('playerDisconnected', { id: socket.id });
		for(var i = 0; i < players.length; i++){
			if(players[i].id == socket.id){
				players.splice(i, 1);
			}
		}
	});
	players.push(new player(socket.id, 0, 0));
});

function player(id, x, y){
	this.id = id;
	this.x = x;
	this.y = y;
}