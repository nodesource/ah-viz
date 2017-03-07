const data = require('../samples/one-file.read-file.processed.json')

const mungeData = require('../lib/munge-data')
const Operation = require('../lib/operation')
const debugData = require('debug')('viz:data')

const { lifetime, operations } = mungeData(data)

debugData({ lifetime, operations })

//
// Visualization
//
const Visualizer = require('../lib/visualizer')
const width = 650
const height = 340
const ratioX = width / lifetime
const ratioY = 1
const svg = document.createElement('svg')
document.body.appendChild(svg)
const details = document.createElement('div')
document.body.appendChild(details)

const visualizer = new Visualizer({
    svg
  , width
  , height
  , ratioX
  , ratioY
  , onoperationClicked
})
visualizer.render(operations)

function onoperationClicked({ operation, name }) {
  details.innerHTML = new Operation({ operation, name }).render()
}
