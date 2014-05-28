var marked = require('marked')
var fs = require('fs')
var mkdirp =  require('mkdirp')

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
})

module.exports = function htmlify(markdown, filename) {

  mkdirp('html', function (err) {
    if (err) return console.log(err)
    else console.log('make md file')
  })


  var html = marked(markdown)
  fs.writeFile('html/' + filename + '.html', html, function (err) {
    if (err) return console.log(err)
    console.log('Wrote' + filename + '.html');
  })
}
