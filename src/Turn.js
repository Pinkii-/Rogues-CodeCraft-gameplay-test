const {Player} = require('./Player.js')
const {Plataform} = require('./Plataform.js')
const C = require('./constants.js')
const clone = require('clone')

class Turn {
  constructor () {
    this.players = []
    this.inputs = []
    this.plataforms = []
    this.minPosition = 600
    this.started = false
  }

  initTurn () {
    this.plataforms = this.generatePlataforms()
  }

  generatePlataforms () {
    var plataform = new Plataform(500, this.minPosition, 1000, 200)
    return [plataform]
  }

  evolve (deltaTime) {
    var nextTurn = clone(this)
    nextTurn.players.forEach((player, i) => {
      if (!player.alive) return
      player.applyInput(this.inputs[i])
      player.update(deltaTime)
      player.correctOutsideMap(0, 1000)
      if (player.position.y > 500) player.position.y = 500
    })

    nextTurn.plataforms.forEach((plataform) => {
      nextTurn.players.forEach((player, i) => {
        if (plataform.intersects(player)) {
          player.applyVerticalWallCollision()
        }
      })
    })

    nextTurn.players.forEach((player, i) => {
      if (!player.alive) return
      let bounds = player.getLocalBounds()
      if (bounds.top + bounds.height > this.minPosition + 200) {
        player.alive = false
        player.score = this.minPosition
        // console.log('Un player menos')
      }
    })

    let plataform = nextTurn.plataforms[0]
    if (plataform) {
      let bounds = plataform.getLocalBounds()
      if (bounds.top + bounds.height > this.minPosition + 500) {
        nextTurn.plataforms.shift()
        // console.log('Una plataforma menos')
      }
    }

    let lastPlataform = 10000
    nextTurn.plataforms.forEach((plataform) => {
      let top = plataform.getLocalBounds().top
      if (top < lastPlataform) lastPlataform = top
    })

    if (Math.abs(lastPlataform - this.minPosition) < 1000) {
      let width = (Math.random() * 200) + 300
      let height = 20
      let x = (Math.random() * (1000 - width)) + (width / 2)
      let y = lastPlataform - 100
      let plataform = new Plataform(x, y, width, height)
      nextTurn.plataforms.push(plataform)
      // console.log('new plataform')
    }

    if (this.started) {
      nextTurn.minPosition -= 1
    }

    nextTurn.players.forEach((p) => {
      if (!p.alive) return
      let top = p.getLocalBounds().top
      if (nextTurn.minPosition - 500 > top) {
        nextTurn.minPosition = top + 500
        nextTurn.started = true
      }
    })

    return nextTurn
  }

  addPlayer (pos) {
    let player = new Player(500, 400)

    if (pos <= this.players.length) {
      this.players[pos] = player
    } else {
      this.players.push(player)
      this.inputs.push(null)
    }
  }

  getLocalsBounds () {
    var ret = []
    this.plataforms.forEach((p) => {
      let aux = p.getLocalBounds()
      aux.color = C.COLORS[0]
      ret.push(aux)
    })
    this.players.forEach((p, i) => {
      if (!p.alive) return
      let aux = p.getLocalBounds()
      aux.color = C.COLORS[i + 1]
      ret.push(aux)
    })
    return ret
  }
}

exports.Turn = Turn
