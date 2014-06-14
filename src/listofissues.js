var fs = require('fs')
var prompt = require('prompt')
var path = 'md/'
var spawn = require('child_process').spawn

module.exports = function listofissues(cb) {
  fs.readdir(path, function(err, files) {
    var num = files.length
    var list = files.map(function(name, i) {
      return '  ' + (i + 1) + '. ' + name.replace(/-(\d+)\.\w+$/,'#$1')
    }).join('\n')

    cb(null, '\nYou have these issues:\n' + list + '\n')

    prompt.start()
    prompt.message = ''
    prompt.delimiter = ''

    prompt.get({
      name: 'number',
      description: 'Which issue do you want to open? [1-' + num + ']',
      message: 'Must be a number and <=' + num,
      conform: function(n) {
        return n <= num && n.match(/^\d+$/)
      }
    }, function (err, result) {
      if(result && result.number) {
        var file = './html/' + files[result.number-1].split(/.md/)[0] + '.html'
        cb(null, 'Opening ' + file)
        spawn('open', [file])
      }
    })
  })
}
