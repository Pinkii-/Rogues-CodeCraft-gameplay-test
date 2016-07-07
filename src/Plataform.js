class Plataform {
  constructor (x, y, width, height) {
    this.position = {x, y}
    this.size = {x: width, y: height}
    this.origin = {x: width / 2, y: height / 2}
  }

  setOrigin () {
    if (arguments.length === 1) {
      this.origin = arguments[0]
    } else if (arguments.length === 2) {
      this.origin.x = arguments[0]
      this.origin.y = arguments[1]
    } else console.error('setOrigin: 0 < arguments.length <= 2 and recived: ', arguments.length)
  }

  setPosition () {
    if (arguments.length === 1) {
      this.position = arguments[0]
    } else if (arguments.length === 2) {
      this.position.x = arguments[0]
      this.position.y = arguments[1]
    } else console.error('setPosition: 0 < arguments.length <= 2 and recived: ', arguments.length)
  }

  getLocalBounds () {
    var left = this.position.x - this.origin.x
    var top = this.position.y - this.origin.y
    return {left, top, width: this.size.x, height: this.size.y}
  }

  intersects (other) {
    let r1 = this.getLocalBounds()
    let r2 = other.getLocalBounds()
    let interLeft = Math.max(r1.left, r2.left)
    let interTop = Math.max(r1.top, r2.top)
    let interRight = Math.min(r1.left + r1.width, r2.left + r2.width)
    let interBottom = Math.min(r1.top + r1.height, r2.top + r2.height)

    return (interLeft < interRight) && (interTop < interBottom)
  }
}

exports.Plataform = Plataform
