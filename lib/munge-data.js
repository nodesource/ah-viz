const traverse = require('traverse')

function byCreated(a, b) {
  return a.operation.lifeCycle.created.ns < b.operation.lifeCycle.created.ns
    ? -1
    : 1
}

function getTimeFrame(operationsInOrder) {
  let minCreated = Number.MAX_VALUE
  let maxDestroyed = Number.MIN_VALUE
  for (let i = 0; i < operationsInOrder.length; i++) {
    const { operation } = operationsInOrder[i]
    minCreated = Math.min(minCreated, operation.lifeCycle.created.ns)
    maxDestroyed = Math.max(maxDestroyed, operation.lifeCycle.destroyed.ns)
  }
  return { start: minCreated, end: maxDestroyed }
}

function adjustedLifeCycle(lifeCycle, start) {
  function adjust(acc, k) {
    acc[k] = k === 'timeAlive' ? lifeCycle[k].ns : lifeCycle[k].ns - start
    return acc
  }
  return Object.keys(lifeCycle).reduce(adjust, {})
}
function normalizeTimeStamps(operations, start) {
  // Adjust all timestamps so that start is 0.
  // Also remove the `ms` info that we don't need

  for (let i = 0; i < operations.length; i++) {
    const { operation } = operations[i]
    operation.lifeCycle = adjustedLifeCycle(operation.lifeCycle, start)
  }
}

function onnode(x) {
  if (this.key !== 'data') return
  if (!Array.isArray(x)) return
  if (this.parent == null || this.parent.parent == null || this.parent.parent.node.type !== 'Buffer') return
  const s = new Buffer(x).toString('utf8')
  this.update(s)
}

function stringifyBuffers(data) {
  // for demos good enough .. don't do this for realz
  traverse(data).forEach(onnode)
}

module.exports = function mungeData(data) {
  const operationsInOrder = data.sort(byCreated)
  const timeFrame = getTimeFrame(operationsInOrder)
  const timeDelta = timeFrame.end - timeFrame.start

  stringifyBuffers(operationsInOrder)
  normalizeTimeStamps(operationsInOrder, timeFrame.start)
  return { lifetime: timeDelta, operations: operationsInOrder }
}
