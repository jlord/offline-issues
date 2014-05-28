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

module.exports = function htmlify(markdown) {
  var html = marked(markdown)
  console.log(html)
}
