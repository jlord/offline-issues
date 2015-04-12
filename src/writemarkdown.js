var fs = require('fs')
var handlebars = require('handlebars')
var mkdirp =  require('mkdirp')

module.exports = function writemarkdown(cb) {

  mkdirp('md', function (err) {
    if (err) return cb(err, "Error creating md directory.")
  })

  var issues = fs.readFileSync('comments.json')
  issues = JSON.parse(issues)
  issues.forEach(function(issue) {
    var filename = repoDetails(issue.url)
    var source = fs.readFileSync(__dirname + '/templates/markdown.hbs')
    var template = handlebars.compile(source.toString())
    var result = template(issue)
    fs.writeFile('md/' + filename + '.md', result, function (err) {
      if (err) return cb(err, "Error writing md file.")
    })
  })
  cb(null, 'Wrote markdown files.')

}

function repoDetails(issue) {
  var a = issue.split('/')
  var filename =  a[3] + '-' + a[4] + '-' + a[6]
  return filename
}
