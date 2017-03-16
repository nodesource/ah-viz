const {
  renderFunction
, renderFunctionLocation
} = require('./renderers')
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
      ${this._renderRemaining(x)}
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
    return (
      `
      <tr>
        <td>${renderFunction(fn)}</td>
        <td>${fn.args && fn.args['0'] && fn.args['0']}</td>
        <td>${fn.args && fn.args['1'] && fn.args['1'].val.utf8}</td>
      </tr>
      `)
  }

  _renderRemaining(x) {
    const handledKeys = [ 'createdAt', 'lifeCycle', 'userFunctions' ]
    const remainingKeys = Object.keys(x).filter(x => handledKeys.indexOf(x) < 0)

    function toRow(k) {
      let v = x[k]
      if (typeof v === 'object') v = JSON.stringify(v)
      return `<tr><td>${k}</td><td>${v}</td></tr>`
    }

    return `<table>${remainingKeys.map(toRow).join('')}</table>`
  }
}

module.exports = Operation
