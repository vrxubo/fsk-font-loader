var fontFunc = require('fsk-font-webpack');
var loaderUtils = require('loader-utils');
module.exports = function (source) {
  var callback = this.async();
  var query = loaderUtils.parseQuery(this.query);
  fontFunc(query, function (err, css) {
    if (err) {
      if (err.code === 'ENOENT') {
        callback(null, source);
      } else {
        callback(err, source);
      }
    } else {
      callback(err, source + css);
    }
  })
}