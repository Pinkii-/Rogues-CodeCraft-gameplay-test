const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const {Game} = require('../src/Game.js')
const fixedDeltaTime = (1 / 60.0) * 1000
const PORT = process.env.PORT || 3000

var game = new Game()

app.use(express.static('dist'))
app.get('/', function (req, res) {
  res.sendfile('../dist/index.html')
})

http.listen(PORT, function () {
  console.log('listening on *:3000')
})

io.on('connection', (socket) => {
  console.log(`a socket with id ${socket.id} connected`)
  game.onPlayerJoin(socket)
  socket.on('changeDir', onChangeDir)
  socket.on('disconnect', onDisconnect)
  socket.on('playerName', onPlayerName)
})

function onPlayerName (name) {
  game.onPlayerName(this, name)
}

function onChangeDir (dir, nTurn) {
  game.onPlayerInput(this, dir, nTurn)
}

function onDisconnect () {
  game.onPlayerLeave(this)
}

setInterval(function () {
  game.tick(fixedDeltaTime / 1000)
}, fixedDeltaTime)
