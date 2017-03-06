const Raphael = require('raphael')
require('./raphael-extensions')(Raphael)

const EventEmitter = require('events')

class SvgTracker extends EventEmitter {
  constructor({
      svg
    , width
    , height
    , ratioX
    , ratioY
    , margin
  }) {
    super()
    // svg context
    this._ctx = Raphael(svg, width, height)
    this._panzoom = this._ctx.panzoom({ zoomStep: 0.01, maxZoom: 70 })
    this._panzoom.enable()

    // numbers
    this._ratioX = ratioX
    this._ratioY = ratioY
    this._fontSize = this._ratioY / 2
    this._margin = margin

    this._svg = new Map()
    this._sets = new Map()
    this._highlighted = []
  }

  clear() {
    this.clearSvg()
    this._ctx.clear()
    return this
  }

  highlight(el) {
    el.addClass('highlight')
    this._highlighted.push(el)
  }

  clearHighlights() {
    let el
    while ((el = this._highlighted.pop())) {
      el.removeClass('highlight')
    }
  }

  addSet(key, fn) {
    this._ctx.setStart()
    fn()
    const set = this._ctx.setFinish()
    this._sets.set(key, set)
  }

  hasSet(key) {
    return this._sets.has(key)
  }

  getSet(key) {
    return this._sets.get(key)
  }

  addSvg(key, el) {
    if (this.hasSvg(key)) this.rmSvg(key)
    this._svg.set(key, el)
    this._debugSvg(`add ${key}`)
    this._debugSvg(this.listKeys())
    return el
  }

  hasSvg(key) {
    return this._svg.has(key)
  }

  getSvg(key) {
    return this._svg.get(key)
  }

  rmSvg(key, logMisses = true) {
    // if we remove this async, i.e. when animating it could have
    // been removed in the meantime, so we make sure we don't error in that case
    if (!this.hasSvg(key)) {
      if (logMisses) {
        this._debug(`Tried to remove [${key}] which did not exist`)
      }
      return this
    }
    this.getSvg(key).remove()
    this._svg.delete(key)
    this._debugSvg(`rm ${key}`)
    this._debugSvg(this.listKeys())
    return this
  }

  listEntries() {
    return Array.from(this._svg.entries())
  }

  listKeys() {
    return Array.from(this._svg.keys())
  }

  clearSvg() {
    for (let k in this._svg.keys()) this.rmSvg(k)
  }

  _debugSvg(s) {
    if (!this._debugSvgOn) return
    if (typeof this._debugger === 'function') this._debugger('svg:' + s)
  }

  //
  // SVG methods
  //
  _line(pos1, pos2, clazz) {
    pos1 = this._normalizePosition(pos1)
    pos2 = this._normalizePosition(pos2)
    const path = 'M' + pos1.x + ' ' + pos1.y + ' L' + pos2.x + ' ' + pos2.y
    return this._ctx.path(path)
      .addClass(clazz)
      .translate(0.5, 0.5)
  }

  _rect(pos, size, clazz) {
    pos = this._normalizePosition(pos)
    size = this._normalizeSize(size)
    return this._ctx
      .rect(pos.x, pos.y, size.w, size.h)
      .addClass(clazz)
  }

  _text(pos, text, clazz, customFontSize) {
    pos = this._normalizePosition(pos)
    return this._ctx.text(pos.x, pos.y, text)
      .addClass(clazz)
      .attr({ 'font-size':(customFontSize || this._fontSize) * this._ratioY + 'px' })
  }

  _circle(pos, r, clazz) {
    pos = this._normalizePosition(pos)
    r = this._ratioX * r
    this._ctx
      .circle(pos.x, pos.y, r)
      .addClass(clazz)
  }

  _normalizePosition(pos) {
    return pos.scale(this._ratioX, this._ratioY * this._margin)
  }

  _normalizeSize(size) {
    return { w: size.w * this._ratioX, h: size.h * this._ratioY }
  }
}

module.exports = SvgTracker
