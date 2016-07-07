const express = require('express')
const app = express()
const http = require('http').Server(app)
// const io = require('socket.io')(http)
const {Game} = require('../src/Game.js')

const PORT = process.env.PORT || 3000

var game = new Game()

console.log(game.turn)

app.use(express.static('dist'))
app.get('/', function (req, res) {
  res.sendfile('../dist/index.html')
})

http.listen(PORT, function () {
  console.log('listening on *:3000')
})
