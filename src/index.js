var request = require('request')
var fs = require('fs')
var runParallel = require('run-parallel')
var writemarkdown = require('./writemarkdown.js')
var writehtml = require('./writehtml.js')

var base = 'https://api.github.com'
var headers = {"user-agent": "offline-issues module"}

module.exports = function getIssues(token, options, cb) {
  var issueData = []
  
  headers["Authorization"] = 'token ' + token.token
  if (options._.length === 0 && options.html) {
    return writehtml(cb)
  }
  if (options._.length === 0) return cb(null, "No repository given.")
  parseRepo(options, cb)
  
  function parseRepo(options, cb) {
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
      } else {
        repoDetails.name = userAndRepo[1]
        repoDetails.issue = 'all'
      }
      options.repos.push(repoDetails)
      console.log(repoDetails)
    })
    var functionsToDo = options.repos.map(function(repo) {
      return function(cb) {
        getIssue(repo, cb)
      }
    })
    runParallel(functionsToDo, function(err) {
      writeData(cb)
    })
  }

  function getIssue(repo, cb) {
    var url = base + '/repos/' + repo.user + '/' + repo.name + '/issues'
    if (repo.issue === 'all') {
      url = url + '?state=all'
    } else url = url + '/' + repo.issue
    console.log(url)
    request(url, {json: true, headers: headers}, function(err, resp, body) {
      if (err) return cb(err, "Error in request for issue.")
      if (repo.issue === 'all') {
        var functionsToDo = body.map(function(issue) {
          return function(cb) {
            loadIssue(issue, repo, cb)
          }
        })
        runParallel(functionsToDo, cb)
        return
      }
      loadIssue(body, repo, cb)
    })
  }

  function loadIssue(body, repo, cb) {
    var issue = {}

    issue.id = body.id
    issue.url = body.html_url
    issue.title = body.title
    issue.created_by = body.user.login || body.head.user.login
    issue.created_at = new Date(body.created_at).toLocaleDateString()
    issue.body = body.body
    issue.state = body.state
    issue.comments = []
    issue.quicklink = repo.full
    issue.comments_url = body.comments_url

    getComments(issue, repo, cb)
  }

  function getComments(issue, repo, cb) {
    // console.log('get coms', issue)
    if (repo.issue === 'all') {
      var url = issue.comments_url
    } else {
      var url = base + '/repos/' + repo.user + '/' + repo.name + '/issues/' + repo.issue + '/comments'
    }
    console.log(url)
    request(url, {json: true, headers: headers}, function(err, resp, body) {
      if (err) return cb(err, "Error in request for comments.")

      issue.comments = body
      issue.comments.forEach(function(comment) {
        comment.created_at = new Date(comment.created_at).toLocaleDateString()
      })
      issueData.push(issue)
      cb()
    })
  }

  function writeData(cb) {
    var data = JSON.stringify(issueData, null, ' ')
    fs.writeFile('comments.json', data, function (err) {
      if (err) return cb(err, "Error in writing data file.")
      cb(null, 'Wrote data')
      writemarkdown(cb)
      writehtml(cb)
    })
  }
}
