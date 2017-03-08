const data = require('../samples/three-files.read-file.processed.json')

const requestCode = require('../lib/request-code')
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

const codeSnippet = document.createElement('div')
document.body.appendChild(codeSnippet)
codeSnippet.classList.add('code')

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

details.onclick = ondetailsClicked
function ondetailsClicked(e) {
  const link = e.target.tagName === 'A' ? e.target : e.target.parentElement
  if (link.dataset == null || link.dataset.file == null) return
  const { file, line } = link.dataset

  requestCode({ file, line }, oncode)

  function oncode(err, code) {
    if (err) return console.error(err)
    codeSnippet.innerHTML = code
  }
}
