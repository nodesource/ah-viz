function renderFunction(fn) {
  return `
  <a href='#' data-file='${fn.file}' data-line='${fn.line}'>${fn.location}</a>
  `
}

const locationRx = /\(([^:]+):([^:]+):.+\)/
function renderFunctionLocation(location) {
  const m = location.match(locationRx)
  if (m == null) return `<span>${location}</span>`
  const file = m[1]
  const line = m[2]
  return renderFunction({ file, line, location })
}

module.exports = {
  renderFunction, renderFunctionLocation
}
