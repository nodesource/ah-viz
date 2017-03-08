const fs = require('fs')
const server = require('http').createServer()
const { parse: parseUrl } = require('url')
const { parse: parseQuery } = require('querystring')

const PORT = 3333

server
  .on('request', onrequest)
  .on('listening', onlistening)
  .listen(PORT)

// eslint-disable-next-line no-unused-vars
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true))
}

function getCode(file, line, cb) {
  fs.readFile(file, onsrc)
  function onsrc(err, src) {
    if (err) return cb(err)
    const lines = src.toString().split('\n')
    // include 2 lines above and below (lines are zero based)
    const startLine = line - 1 - 2
    const endLine = startLine + 5
    const relevant = lines.slice(startLine, endLine)
    const code = relevant.map((x, idx) => {
      const pointer = startLine + idx + 1 === line ? '→' : ' '
      return `${pointer} ${startLine + idx + 1}: ${x}`
    }).join('\n')
    cb(null, code)
  }
}

function serveFile(req, res) {
  const { query } = parseUrl(req.url)
  const { file, line } = parseQuery(query)
  getCode(file, parseInt(line), oncode)
  function oncode(err, code) {
    if (err) {
      res.writeHead(505)
      return res.end()
    }
    const headers = { 'Content-Type': 'text/plain', 'Content-Length': code.length }
    res.writeHead(200, headers)
    res.write(code)
    res.end()
  }
}

function allowCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Request-Method', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
  res.setHeader('Access-Control-Allow-Headers', 'x-requested-with, Content-Type, origin, authorization')
}

function onrequest(req, res) {
  console.log(req.url)
  allowCORS(res)
  if (req.url.startsWith('/code')) {
    return serveFile(req, res)
  }
  res.writeHead(404)
  res.end()
}

function onlistening() {
  console.log('Listening on http://localhost:%d', PORT)
}
