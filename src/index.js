var request = require('request')
var fs = require('fs')
var writemarkdown = require('./writemarkdown.js')
var writehtml = require('./writehtml.js')

var base = 'https://api.github.com'
var headers = {"user-agent": "offline-issues module",}

var issueData = []
var counter = 1
var done = ''

module.exports = function getIssues(token, options, cb) {
  headers["Authorization"] = 'token ' + token.token
  if (!options._) return cb("No repository given.")
  parseRepo(options)
}

function parseRepo(options) {
  done = options._.length
  options.repos = []

  options._.forEach(function(repo) {
    var repoDetails = {}
    repoDetails.full = repo
    var userAndRepo = repo.split('/')
    repoDetails.user = userAndRepo[0]
    if (userAndRepo[1].indexOf('#') >= 0) {
      var repoAndIssue = userAndRepo[1].split('#')
      repoDetails.name = repoAndIssue[0]
      repoDetails.issue = repoAndIssue[1]
    } else { repoDetails.name = userAndRepo[1] }
    options.repos.push(repoDetails)
  })
  options.repos.forEach(getIssue)
}

function getIssue(repo) {
  var url = base + '/repos/' + repo.user + '/' + repo.name + '/issues/' + repo.issue
  request(url, {json: true, headers: headers}, function(err, resp, body) {
    if (err) return console.log('request', err)
    loadIssue(body, repo)
  })
}

function loadIssue(body, repo) {
  var issue = {}

  issue.id = body.id
  issue.url = body.html_url
  issue.title = body.title
  issue.createdBy = body.user.login || body.head.user.login
  issue.createdOn = body.created_at
  issue.body = body.body
  issue.state = body.state
  issue.comments = []

  getComments(issue, repo)
}

function getComments(issue, repo) {
  var url = base + '/repos/' + repo.user + '/' + repo.name + '/issues/' + repo.issue + '/comments'

  request(url, {json: true, headers: headers}, function(err, resp, body) {
    if (err) return console.log(err)

    issue.comments = body
    issueData.push(issue)

    if (counter === done) {
      writeData(repo)
    } else counter++
  })
}

function writeData(repo) {
  var data = JSON.stringify(issueData, null, ' ')
  fs.writeFile('comments.json', data, function (err) {
    if (err) return console.log(err)
    console.log('Wrote data')
    writemarkdown()
    writehtml()
  })
}
