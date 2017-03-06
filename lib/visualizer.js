const SvgTracker = require('./svg-tracker')

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
  }
}

module.exports = Visualizer
