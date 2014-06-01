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
  console.log(options)
  headers["Authorization"] = 'token ' + token.token
  if (options._.length === 0 && options.html) {
    return writehtml(cb)
  }
  if (options._.length === 0) return cb(null, "No repository given.")
  parseRepo(options, cb)
}

function parseRepo(options, cb) {
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
  options.repos.forEach(function(repo) {
    getIssue(repo, cb)
  })
}

function getIssue(repo, cb) {
  var url = base + '/repos/' + repo.user + '/' + repo.name + '/issues/' + repo.issue
  request(url, {json: true, headers: headers}, function(err, resp, body) {
    if (err) return cb(err, "Error in request for issue.")
    loadIssue(body, repo, cb)
  })
}

function loadIssue(body, repo, cb) {
  var issue = {}

  issue.id = body.id
  issue.url = body.html_url
  issue.title = body.title
  issue.createdBy = body.user.login || body.head.user.login
  issue.createdOn = new Date(body.created_at).toLocaleDateString()
  issue.body = body.body
  issue.state = body.state
  issue.comments = []
  issue.quicklink = repo.full

  getComments(issue, repo, cb)
}

function getComments(issue, repo, cb) {
  var url = base + '/repos/' + repo.user + '/' + repo.name + '/issues/' + repo.issue + '/comments'

  request(url, {json: true, headers: headers}, function(err, resp, body) {
    if (err) return cb(err, "Error in request for comments.")

    issue.comments = body
    issueData.push(issue)

    if (counter === done) {
      writeData(repo, cb)
    } else counter++
  })
}

function writeData(repo, cb) {
  var data = JSON.stringify(issueData, null, ' ')
  fs.writeFile('comments.json', data, function (err) {
    if (err) return cb(err, "Error in writing data file.")
    cb(null, 'Wrote data')
    writemarkdown(cb)
    writehtml(cb)
  })
}
