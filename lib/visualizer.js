const SvgTracker = require('./svg-tracker')
const Position = require('./position')

function noop() {}

class Visualizer extends SvgTracker {
  constructor({
      svg
    , width
    , height
    , ratioX
    , ratioY
    , margin = 1.2
    , onoperationClicked = noop
  }) {
    super({ svg, width, height, ratioX, ratioY, margin })
    this._rectHeight = height / 10
    this._onoperationClicked = onoperationClicked
  }

  render(operations) {
    this.clear()
    for (let i = 0; i < operations.length; i++) {
      const { name, operation } = operations[i]
      this._addOperation({ name, operation, idx: i })
    }
  }

  _addOperation({ name, operation, idx }) {
    const { created, timeAlive } = operation.lifeCycle
    const pos = this._getPos(created, idx)
    const size = this._getSize(timeAlive)
    const className = this._className(name)
    const rect = this._rect(pos, size, className)
    rect.click(() => this._onclick({ operation, name }))
    this._onclick({ operation, name })
  }

  _className(name) {
    return 'operation-rect ' + name.replace(/\./g, '-').toLowerCase()
  }

  _getPos(created, idx) {
    // TODO: be smarter about reusing y space, i.e. to the
    // right of an operation that finished before this one started
    return new Position(created, (this._rectHeight * idx) + this._margin)
  }

  _getSize(timeAlive) {
    // size as well as position are normalized according to ratio by the base class
    return { w: timeAlive, h: this._rectHeight }
  }

  _onclick({ operation, name }) {
    this._onoperationClicked({ operation, name })
  }
}

module.exports = Visualizer
