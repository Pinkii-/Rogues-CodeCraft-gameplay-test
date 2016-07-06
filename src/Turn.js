const {Player} = require('./Player.js')
const C = require('./constants.js')
const clone = require('clone')

class Turn {
  constructor () {
    this.players = []
    this.inputs = []
    this.board = []
  }

  initTurn () {
    this.board = this.generateBoard()
  }

  evolve (deltaTime) {
    var nextTurn = clone(this)
    nextTurn.players.forEach((player, i) => {
      player.applyInput(this.inputs[i])
      player.update(deltaTime)
    })

    nextTurn.players.forEach((player, i) => {
      if (!player.alive) return
      if (player.y < this.minPosition) {
        this.players[i].alive = false
      }
    })
    return nextTurn
  }

  generateBoard () {
    var board = Array(C.MAP_HEIGHT).fill().map(() => Array(C.MAP_WIDTH).fill(C.AIR))
    board[C.MAP_HEIGHT - 1].fill(C.WAL)
    // board[C.MAP_HEIGHT - 2].fill(C.WAL)
    for (let i = 5; i < C.MAP_HEIGHT; i += Math.round(Math.random() * 5) + 4) {
      var left = Math.round(Math.random() * board[0].length - 10)
      var right = left + 10
      for (let l = 0; l < left; ++l) {
        board[i][l] = C.WAL
      }
      for (let r = right; r < board[0].length; ++r) {
        board[i][r] = C.WAL
      }
    }
    return board
  }

  addPlayer () {
    let i = -1
    this.players.forEach((p, ii) => {
      if (p != null) i = ii
    })

    let player = new Player(this.board, this.board[0].length / 2, 2)

    if (i !== -1) {
      this.players[i] = player
    } else {
      this.players.push(player)
      this.inputs.push(null)
    }
  }
}

exports.Turn = Turn
