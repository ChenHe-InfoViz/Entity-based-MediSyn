var fs = require('fs');

require.extensions['.tsv'] = function (module, filename) {
  var string = fs.readFileSync(filename, 'utf8');
  var array = string.split('\n').filter(function(lineString) {
    return lineString;
  }).map(function(lineString) {
    return lineString.split('\t');
  });

  module.exports = array;
};
