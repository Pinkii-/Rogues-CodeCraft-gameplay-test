const {Turn} = require('./Turn.js')

class Game {
  constructor () {
    this.turn = new Turn()
    this.turn.initTurn()
    this.players = {}
    this.sockets = []
  }

  tick (deltaTime) {
    this.turn = this.turn.evolve(deltaTime)
    this.sendState()
  }

  onPlayerJoin (socket) {
    // let socketid = socket.id
    // let pos = null
    // for (let i = 0; i < this.sockets.length; i++) {
    //   if (this.sockets[i] === null) {
    //     pos = i
    //     break
    //   }
    // }
    // if (pos == null) {
    //   this.sockets.push(socket)
    //   pos = this.sockets.length - 1
    // }
    // this.player[socketid] = pos
    var pos
    this.turn.addPlayer(pos)
  }

  onPlayerInput (socket, input) {
    this.turn.inputs[0] = input
  }

  sendState () {
    this.sockets.forEach((s) => {
      if (s) s.emit('game:state', {turn: this.turn, players: this.players, nTurn: this.currentTurn})
    })
  }
}

exports.Game = Game
