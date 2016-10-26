var fs = require('fs')
var path = require('path')

var mkdirp = require('mkdirp')
var handlebars = require('handlebars')
var marked = require('marked')
var cpr = require('cpr')

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

module.exports = function writehtml (options, cb) {
  mkdirp('html', function (err) {
    if (err) return cb(err, 'Error writing HTML directory.')
  })

  if (!options.noStatic) {
    var from = path.resolve(__dirname, '..', 'static')
    cpr(from, './html', { overwrite: true }, function (err, files) {
      if (err) return cb(err, 'Error copying directory.')
      // TODO this may finish after making the HTML files does
    })
  }

  var repositories = getRepositories()

  writeIndex(repositories, cb)
  repositories.forEach(function (repository) {
    writeIssues(repository.issues, cb)
  })

  cb(null, 'Wrote html files.')
}

// Writers
function writeIssues (issues, cb) {
  issues.forEach(function (issue) {
    issue = parseBody(issue)
    var filename = repoDetails(issue.url)
    var source = fs.readFileSync(path.join(__dirname, '/templates/html.hbs'))
    var template = handlebars.compile(source.toString())
    var result = template(issue)
    fs.writeFile('html/' + filename + '.html', result, function (err) {
      if (err) return cb(err, 'Error writing HTML issue file.')
    })
  })
}

function writeIndex (repositories, cb) {
  var source = fs.readFileSync(path.join(__dirname, '/templates/index.hbs'))
  var template = handlebars.compile(source.toString())

  repositories.forEach(function (repository) {
    repository.issues.forEach(function (issue) {
      issue.offlineUrl = repoDetails(issue.url)
    })
  })

  var result = template({ repositories: repositories })
  fs.writeFile('html/index.html', result, function (err) {
    if (err) return cb(err, 'Error writing HTML index file.')
  })
}

// Parsers
function getRepositories () {
  var comments = getComments()
  var repositories = []     // Array of repository objects
  var repositoryNames = {}  // Index of repositories (name => index)
  comments.forEach(function (comment) {
    var name = repoName(comment)
    // Initialize a repo object if necessary
    if (!(name in repositoryNames)) {
      repositoryNames[name] = repositories.length
      repositories.push({
        name: name,
        issues: []
      })
    }
    // Push the comment into the repo's issue array
    var repositoryIndex = repositoryNames[name]
    repositories[repositoryIndex].issues.push(comment)
  })
  return repositories
}

function getComments() {
  var rawComments = fs.readFileSync('comments.json')
  var parsedComments = JSON.parse(rawComments)
  var comments = []       // Returnable array of comments
  var commentsIndex = {}  // Used to determine uniqueness
  parsedComments.forEach(function (comment) {
    if (comment.id in commentsIndex) return
    commentsIndex[comment.id] = true
    comments.push(comment)
  })
  return comments
}

// Helpers
function repoName (comment) {
  var a = comment.url.split('/')
  var name = a[3] + '/' + a[4]
  return name
}

function repoDetails (issue) {
  var a = issue.split('/')
  var filename = a[3] + '-' + a[4] + '-' + a[6]
  return filename
}

// since comments are in Markdown
// we should parse them into HTML
// before putting them in the template
function parseBody (issue) {
  if (issue.body === null) issue.body = ''
  else issue.body = marked(issue.body)
  issue.comments = issue.comments.map(function (issue) {
    issue.body = marked(issue.body)
    return issue
  })
  return issue
}
