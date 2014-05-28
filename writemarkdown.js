var fs = require('fs')
var handlebars = require('handlebars')
var htmlify = require('./htmlify.js')

// module.exports = function writemarkdown() {
  var issues = fs.readFileSync('comments.json')
  issues = JSON.parse(issues)
  issues.forEach(function(issue, i) {
    var source = fs.readFileSync('issue.hbs')
    var template = handlebars.compile(source.toString())
    var result = template(issue)
    console.log(result)
    fs.writeFile('issue' + i + '.md', result, function (err) {
      if (err) console.log(errs)
      console.log('Wrote' + ' issue' + i + '.md');
    })
    htmlify(result)
  })
//}
