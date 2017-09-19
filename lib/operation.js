const {
  renderFunction
, renderFunctionLocation
} = require('./renderers')

const tableify = require('tableify')
/**
 *
 *
 * Sample operation data:
 *
 * ```js
 *{ name: 'fs.readFile',
 *  steps: 4,
 *  rootId: 17,
 *  operation:
 *   { lifeCycle: { created: 0, destroyed: 41836000, timeAlive: 41836000 },
 *     createdAt: 'at Test.<anonymous> (/Volumes/d/dev/js/async-hooks/ah-fs/test/read-one-file.js:36:6)',
 *     open: { id: 10, triggerId: 1 },
 *     stat: { id: 11, triggerId: 10 },
 *     read: { id: 12, triggerId: 11 },
 *     close: { id: 13, triggerId: 12 },
 *     userFunctions:
 *      [ { file: '/Volumes/d/dev/js/async-hooks/ah-fs/test/read-one-file.js',
 *          line: 39,
 *          column: 17,
 *          inferredName: '',
 *          name: 'onread',
 *          location: 'onread (/Volumes/d/dev/js/async-hooks/ah-fs/test/read-one-file.js:39:17)',
 *          args:
 *           { '0': null,
 *             '1': { type: 'Buffer', len: 6108, included: 18, val: [Object] },
 *             proto: 'Object' },
 *          propertyPaths:
 *           [ 'open.resource.context.callback',
 *             'stat.resource.context.callback',
 *             'read.resource.context.callback',
 *             'close.resource.context.callback' ] } ] } }
 * ```
 *
 *
 *
 * @name
 * @function
 */
class Operation {
  constructor({ operation, name }) {
    this._operation = operation
    this._name = name
  }

  render() {
    const x = this._operation
    const tableified = tableify(x)
    return (
      `
      <table>
        <tr>
          <td class='label'>Name</td>
          <td>${this._name}</td>
        </tr>
        <tr>
          <td class='label'>Origin</td>
          <td>${renderFunctionLocation(x.createdAt)}</td>
        </tr>
      </table>
      ${this._renderFunctions(x.userFunctions)}
      <h4>Operations</h4>
      <div class="operation-details-table">
        ${tableified}
      </div>
      `
    )
  }

  _renderFunctions(fns) {
    return (
      `
      <div>
        <h4>Registered Callbacks</h4>
        <table>
          <thead>
            <th>location</th>
            <th>args[0]</th>
            <th>args[1]</th>
          </thead>
          ${fns.map(fn => this._renderFunction(fn)).join('')}
        </table>
      </div>
      `)
  }

  _renderFunction(fn) {
    const arg0 = `<td>${fn.args && fn.args[0] && fn.args[0]}</td>`
    const arg1 = `<td>${fn.args && fn.args[1] && fn.args[1].val.utf8}</td>`
    return (
      `
      <tr>
        <td>${renderFunction(fn)}</td>
        ${arg0}
        ${arg1}
      </tr>
      `)
  }
}

module.exports = Operation
