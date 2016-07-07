const {Turn} = require('./Turn.js')

class Game {
  constructor () {
    this.turn = new Turn()
    this.turn.initTurn()
    this.players = {}
    this.sockets = []
    this.running = false
  }

  restartGame () {
    this.turn = new Turn()
    this.turn.initTurn()
    this.sockets.forEach((s, i) => {
      if (s == null) return
      this.turn.addPlayer(i)
    })
    this.sendState()
    this.running = true
    console.log('restarting game')
  }

  tick (deltaTime) {
    var numOfPlayers = this.turn.players.filter(
    (player) => {
      if (player === null) {
        // console.log('Tengo un player que es null')
        return false
      } else {
        // console.log(`Tengo un player ${player.alive}`)
        return player.alive
      }
    })
    .length

    // console.log('numOfPlayers', numOfPlayers)

    if (numOfPlayers !== 0) {
      // console.log('hi')
      if (!this.running) {
        this.restartGame()
      } else {
        // console.log('step')
        this.turn = this.turn.evolve(deltaTime)
        this.sendState()
      }
    } else if (this.sockets.filter((s) => s != null).length > 0) {
      this.restartGame()
    } else {
      this.running = false
    }
  }

  onPlayerJoin (socket) {
    let socketid = socket.id
    let pos = null
    for (let i = 0; i < this.sockets.length; i++) {
      if (this.sockets[i] === null) {
        pos = i
        break
      }
    }
    if (pos == null) {
      pos = this.sockets.length
      this.sockets.push(socket)
    }
    this.players[socketid] = pos
    this.turn.addPlayer(pos)
    this.sendState()
    console.log('New player yay!', pos)
  }

  onPlayerInput (socket, input) {
    this.turn.inputs[this.players[socket.id]] = input
  }

  onPlayerLeave (socket) {
    let pos = this.players[socket.id]
    delete this.players[socket.id]
    this.sockets[pos] = null

    console.log('LEAVING :D')
  }

  sendState () {
    this.sockets.forEach((s) => {
      if (s) s.emit('game:state', {turn: this.turn, players: this.players, nTurn: this.currentTurn})
    })
  }
}

exports.Game = Game
