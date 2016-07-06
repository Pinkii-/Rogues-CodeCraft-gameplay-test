const C = require('./constants.js')
const Util = require('./util.js')
const clone = require('clone')

class Player {
  constructor (board, x, y) {
    this.board = board
    this.position = {x, y}
    this.velocity = {x: 0, y: 0}
    this.landed = true
  }

  applyInput (input) {
    if (this.landed && (C.JUMP & input) > 0) {
      this.velocity.y = C.JUMP_SPEED
      this.landed = false
    }
    if ((C.LEFT & input) > 0) {
      this.velocity.x -= C.MOVEMENT_ACCELERATION
    }
    if ((C.RIGHT & input) > 0) {
      this.velocity.x += C.MOVEMENT_ACCELERATION
    }
  }

  update (deltaTime) {
    var direction = this.velocity.x === 0 ? 0 : Math.abs(this.velocity.x) / this.velocity.x
    if (Math.abs(this.velocity.x) > 0.1) this.velocity.x -= C.FRICTION * deltaTime * direction
    else this.velocity.x = 0
    this.velocity.y -= C.GRAVITY * deltaTime

    // console.log(this.velocity.x, this.velocity.y)

    var position = clone(this.position)
    position.x += this.velocity.x * deltaTime
    position.y += this.velocity.y * deltaTime

    // console.log(deltaTime, position.x, position.y)

    if (!this.isInsideWall(position)) { // Shame phisics
      this.position = position
    } else if (!this.isInsideWall({x: position.x, y: this.position.y})) {
      this.position.x = position.x
      if (this.velocity.y < 0) this.landed = true
      this.velocity.y = 0
    } else if (!this.isInsideWall({x: this.position.x, y: position.y})) {
      this.position.y = position.y
      this.velocity.x = 0
    } else {
      if (this.velocity.y < 0) this.landed = true
      this.velocity = {x: 0, y: 0}
    }
  }

  isInsideWall (pos) {
    let realpos = Util.realToBoard(this.board, pos)
    return this.board[Math.floor(realpos.y)][Math.floor(realpos.x)] !== C.AIR
  }
}

exports.Player = Player
