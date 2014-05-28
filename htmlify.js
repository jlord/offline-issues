var marked = require('marked')
var fs = require('fs')

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

module.exports = function htmlify(markdown, i) {
  var html = marked(markdown)
  fs.writeFile('issue' + i + '.html', html, function (err) {
    if (err) return console.log(err)
    console.log('Wrote' + ' issue' + i + '.html');
  })
}
