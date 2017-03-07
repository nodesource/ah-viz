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
        <thead>
          <th>type</th>
          <th>created at</th>
        </thead>
        <tr>
          <td>${this._name}</td>
          <td>${x.createdAt}</td>
        </tr>
      </table>
      ${this._renderFunctions(x.userFunctions)}
      `
    )
  }

  _renderFunctions(fns) {
    return (
      `
      <table>
        <thead>
          <th>callback name</th>
          <th>callback location</th>
          <th>callback args</th>
        </thead>
        ${fns.map(fn => this._renderFunction(fn))}
      </table>
      `)
  }

  _renderFunction(fn) {
    return (
      `
      <tr>
        <td>${fn.name}</td>
        <td>${fn.location}</td>
        <td>${fn.args && fn.args['1'] && fn.args['1'].val.utf8}</td>
      </tr>
      `)
  }
}

module.exports = Operation