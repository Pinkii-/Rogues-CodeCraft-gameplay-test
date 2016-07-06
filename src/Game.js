const {Turn} = require('./Turn.js')

class Game {
  constructor () {
    this.turn = new Turn()
    this.turn.initTurn()
  }

  tick (deltaTime) {
    // debugger
    this.turn = this.turn.evolve(deltaTime)
  }

  onPlayerJoin (socket) {
    this.turn.addPlayer()
  }

  onPlayerInput (socket, input) {
    this.turn.inputs[0] = input
  }
}

exports.Game = Game
