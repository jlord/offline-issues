var fs = require('fs')
var handlebars = require('handlebars')
var htmlify = require('./htmlify.js')
var mkdirp =  require('mkdirp')


module.exports = function writemarkdown() {

  mkdirp('md', function (err) {
    if (err) return console.log(err)
    else console.log('make md file')
  })

  var issues = fs.readFileSync('comments.json')
  issues = JSON.parse(issues)
  console.log(issues)
  console.log(issues.length)
  issues.forEach(function(issue) {
    var filename = repoDetails(issue.url)
    var source = fs.readFileSync('issue.hbs')
    var template = handlebars.compile(source.toString())
    var result = template(issue)
    fs.writeFile('md/' + filename + '.md', result, function (err) {
      if (err) return console.log(err)
      console.log('Wrote' + filename + '.md');
    })
    htmlify(result, filename)
  })
}

function repoDetails(issue) {
  console.log('issue', issue)
  var a = issue.split('/')
  var filename =  a[3] + '-' + a[4] + '-' + a[6]
  return filename
}
