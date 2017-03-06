module.exports = function extensions(Raphael) {
  Raphael.el.addClass = function addClass(clazz) {
    const existingStr = this.attr('class')
    const classes = existingStr ? existingStr.split(' ') : []
    if (~classes.indexOf(clazz)) return
    classes.push(clazz)
    this.attr('class', classes.join(' '))
    return this
  }

  Raphael.el.removeClass = function removeClass(clazz) {
    const existingStr = this.attr('class')
    const classes = existingStr ? existingStr.split(' ') : []
    const idx = classes.indexOf(clazz)
    if (!~idx) return
    classes.splice(idx, 1)
    this.attr('class', classes.join(' '))
    return this
  }

  Raphael.el.toggleClass = function toggleClass(clazz) {
    const existingStr = this.attr('class')
    const classes = existingStr ? existingStr.split(' ') : []
    const idx = classes.indexOf(clazz)
    if (!~idx) {
      this.addClass(clazz)
    } else {
      this.removeClass(clazz)
    }
  }
}
