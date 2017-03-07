class Position {
  /**
   * Svg Position
   *
   * @param {number} x x coord
   * @param {number} y y coord
   */
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  translateOriginY(height) {
    return new Position(this.x, (-this.y) + height, this.compass)
  }

  scale(ratioX, ratioY) {
    return new Position(this.x * ratioX, this.y * ratioY)
  }

  moveX(x) {
    return new Position(this.x + x, this.y)
  }

  moveY(y) {
    return new Position(this.x, this.y + y)
  }

  setX(x) {
    return new Position(x, this.y)
  }

  setY(y) {
    return new Position(this.x, y)
  }
}

Position.fromHash = function fromHash({ x, y }) {
  return new Position(x, y)
}

module.exports = Position
