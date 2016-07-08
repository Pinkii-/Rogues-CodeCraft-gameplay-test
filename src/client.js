/* global myCanvas */
const io = require('socket.io-client')
const socket = io()
const {Game} = require('./Game.js')
const {Turn} = require('./Turn.js')
const {Player} = require('./Player.js')
const {Plataform} = require('./Plataform.js')
const C = require('./constants.js')
const clearColor = 'black'
const username = window.prompt("What's your username?")
var alfaClear = 0.2

var game = new Game()

function onGameState (g) {
  let turn = new Turn()
  Object.assign(turn, g.turn)
  game.turn = turn
  let players = game.turn.players
  for (let n = 0; n < players.length; ++n) {
    let aux = new Player()
    Object.assign(aux, players[n])
    players[n] = aux
  }
  let plataforms = game.turn.plataforms
  for (let n = 0; n < plataforms.length; ++n) {
    let aux = new Plataform()
    Object.assign(aux, plataforms[n])
    plataforms[n] = aux
  }
  renderGame()
}

socket.on('connect', () => {
  socket.on('game:state', onGameState)
  socket.emit('playerName', username)
})

// game.onPlayerJoin()
var input = 0

var fixedDeltaTime = (1 / 60.0) * 1000

myCanvas.width = 1000
myCanvas.height = Math.min(window.innerHeight, 665)

// const offsetFactor = 1
// var edge = Math.min(window.innerWidth - 100, window.innerHeight - 100) / (game.turn.board.length * offsetFactor)
const ctx = myCanvas.getContext('2d')

function renderGame () {
  ctx.globalAlpha = alfaClear
  ctx.fillStyle = clearColor
  ctx.fillRect(0, 0, myCanvas.width, myCanvas.height)
  ctx.save()
  ctx.translate(0, myCanvas.height - game.turn.minPosition)
  ctx.globalAlpha = 1
  // debugger
  var thingsToDraw = game.turn.getLocalsBounds()

  thingsToDraw.forEach((t) => {
    ctx.fillStyle = t.color
    ctx.fillRect(t.left, t.top, t.width, t.height)
  })

  ctx.restore()

  // for (let i = 1; i < game.turn.board.length; ++i) {
  //   const row = game.turn.board[i]
  //   for (let j = 0; j < row.length; ++j) {
  //     const cell = row[j]
  //     const color = C.COLORS[cell]
  //     ctx.fillStyle = color
  //     ctx.fillRect(j * (edge * offsetFactor), i * (edge * offsetFactor), edge, edge)
  //   }
  // }
  // game.turn.players.forEach((p, ii) => {
  //   if (!p.alive) return
  //   const pos = Util.realToBoard(game.turn.board, 0, {x: p.position.x, y: p.position.y + 1})
  //   const color = C.COLORS[ii + 2]
  //   ctx.fillStyle = color
  //   ctx.fillRect(pos.x * (edge * offsetFactor), pos.y * (edge * offsetFactor), edge, edge)
  // })
  // ctx.fillStyle = 'green'
  // ctx.fillRect(0, (C.MAP_HEIGHT - game.turn.minPosition) * edge, C.MAP_WIDTH * edge, 5)
}

// renderGame()
setInterval(function () {
  // game.onPlayerInput(null, input)
  socket.emit('changeDir', input)
  // game.tick(fixedDeltaTime / 1000)
  // renderGame()
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

document.getElementById('border').style.width = (window.innerWidth - 1000) + 'px'
document.getElementById('instructions').style.width = document.getElementById('border').style.width
