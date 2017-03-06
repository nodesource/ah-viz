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

module.exports = function mungeData(data) {
  const operationsInOrder = data.sort(byCreated)
  const timeFrame = getTimeFrame(operationsInOrder)
  const timeDelta = timeFrame.end - timeFrame.start

  normalizeTimeStamps(operationsInOrder, timeFrame.start)
  return { lifetime: timeDelta, operations: operationsInOrder }
}
