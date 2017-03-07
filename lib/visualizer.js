const SvgTracker = require('./svg-tracker')
const Position = require('./position')

class Visualizer extends SvgTracker {
  constructor({
      svg
    , width
    , height
    , ratioX
    , ratioY
    , margin = 1.2
  }) {
    super({ svg, width, height, ratioX, ratioY, margin })
    this._rectHeight = height / 10
  }

  render(operations) {
    this.clear()
    for (let i = 0; i < operations.length; i++) {
      const { name, operation } = operations[i]
      const { created, timeAlive } = operation.lifeCycle
      const pos = this._getPos(created, i)
      const size = this._getSize(timeAlive)
      const className = this._className(name)
      this._rect(pos, size, className)
    }
  }

  _className(name) {
    return name.replace(/\./g, '-').toLowerCase()
  }
  _getPos(created, idx) {
    // TODO: be smarter about reusing y space, i.e. to the
    // right of an operation that finished before this one started

    return new Position({ x: created, y: (this._rectHeight * idx) + this._margin })
  }

  _getSize(timeAlive) {
    // size as well as position are normalized according to ratio by the base class
    return { w: timeAlive, h: this._rectHeight }
  }

}

module.exports = Visualizer
