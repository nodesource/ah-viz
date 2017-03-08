const xhr = require('xhr')
const PORT = 3333
module.exports = function requestCode({ file, line }, cb) {
  xhr({
    uri: `http://localhost:${PORT}/code?file=${file}&line=${line}`
  }, onresponse)

  function onresponse(err, res, body) {
    if (err) return cb(err)
    cb(null, body)
  }
}
