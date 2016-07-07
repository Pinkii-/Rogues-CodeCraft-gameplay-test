const C = require('./constants.js')

class Player {
  constructor (x, y) {
    this.position = {x, y}
    this.velocity = {x: 0, y: 0}
    this.landed = true
    this.alive = true
    this.size = {x: C.PLAYER_WIDTH, y: C.PLAYER_HEIGHT}
    this.origin = {x: this.size.x / 2, y: this.size.y / 2}
  }

  applyInput (input) {
    if (this.landed && (C.JUMP & input) > 0) {
      this.velocity.y = -C.JUMP_SPEED
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
    this.velocity.y += C.GRAVITY * deltaTime

    // console.log(this.velocity.x, this.velocity.y)

    this.position.x += this.velocity.x * deltaTime
    this.position.y += this.velocity.y * deltaTime
  }

  correctOutsideMap (left, right) {
    if (this.position.x + this.origin.x - this.size.x < left && this.velocity.x <= 0) {
      this.position.x = left + this.size.x - this.origin.x
      this.velocity.x = 0
    } else if (this.position.x + this.origin.x + this.size.x > right && this.velocity.x >= 0) {
      this.position.x = right - this.size.x + this.origin.x
      this.velocity.x = 0
    }
  }

  applyVerticalWallCollision () {
    this.landed = true
    if (this.velocity.y > 0) {
      this.velocity.y = 0
    }
  }

  getLocalBounds () {
    return {
      left: this.position.x - this.origin.x,
      top: this.position.y - this.origin.y,
      width: this.size.x,
      height: this.size.y
    }
  }
}

exports.Player = Player
