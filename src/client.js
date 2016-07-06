/* global myCanvas */
// const io = require('socket.io-client')
const {Game} = require('./Game.js')
const C = require('./constants.js')
const Util = require('./util.js')

var game = new Game()
game.onPlayerJoin()
var input = 0

var fixedDeltaTime = (1 / 60.0) * 1000

myCanvas.width = window.innerWidth
myCanvas.height = window.innerHeight

const offsetFactor = 1
var edge = Math.min(window.innerWidth - 100, window.innerHeight - 100) / (game.turn.board.length * offsetFactor)
const ctx = myCanvas.getContext('2d')

function renderGame () {
  // debugger
  for (let i = 0; i < game.turn.board.length; ++i) {
    const row = game.turn.board[i]
    for (let j = 0; j < row.length; ++j) {
      const cell = row[j]
      const color = C.COLORS[cell]
      ctx.fillStyle = color
      ctx.fillRect(j * (edge * offsetFactor), i * (edge * offsetFactor), edge, edge)
    }
  }
  game.turn.players.forEach((p, ii) => {
    const pos = Util.realToBoard(game.turn.board, {x: p.position.x, y: p.position.y})
    const color = C.COLORS[ii + 2]
    ctx.fillStyle = color
    ctx.fillRect(pos.x * (edge * offsetFactor), (pos.y - 1) * (edge * offsetFactor), edge, edge)
  })
}

renderGame()
setInterval(function () {
  game.onPlayerInput(null, input)
  game.tick(fixedDeltaTime / 1000)
  renderGame()
}, fixedDeltaTime)

const KEY = {
  W: 87,
  A: 65,
  S: 83,
  D: 68
}

document.addEventListener('keydown', function (e) {
  switch (e.keyCode) {
    case KEY.W:
      input = input | C.JUMP
      break
    case KEY.A:
      input = input | C.LEFT
      break
    case KEY.D:
      input = input | C.RIGHT
      break
    default:
  }
})

document.addEventListener('keyup', function (e) {
  switch (e.keyCode) {
    case KEY.W:
      input = input & ~C.JUMP
      break
    case KEY.A:
      input = input & ~C.LEFT
      break
    case KEY.D:
      input = input & ~C.RIGHT
      break
    default:
  }
})
