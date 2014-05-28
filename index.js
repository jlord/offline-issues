var request = require('request')
var mkdirp =  require('mkdirp')
var fs = require('fs')

var base = 'https://api.github.com'

var headers = {"user-agent": "offline-issues module",}
var pageNum = 1
var repoNum = 1


// {
//   _: [ 'jlord/offline-issues', 'muan/github-gmail' ],
//   by: 'jlord',
//   all: true
// }

module.exports = function getIssues(token, options, cb) {
  if (!options._) return cb("No repository given.")
  parseRepo(options)

  headers["Authorization"] = 'token ' + token.token

  // https://api.github.com/repos/github/

}


function parseRepo(options) {
  options.numberOf = options._.length
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
  console.log(options)
  // do what's next
  // route off requests
  // makeRequest(pageNum, options)
}

function makeRequest(i, options) {
  var query = '/issues?page='
  var limit = '&per_page=100'

  options.repos.forEach(function (repo) {
    var url = base + '/repos/' + user + '/' + repo + query + pageNum + limit
    // request(url, {json: true, headers: headers}, getIssues)
  })
}

// taken from other module, need to adapt
function getIssues(err, response, body) {
  if (err) console.log(err)
  // if there are no more repos to look through
  if (repoNum === nuxrepos.length) {
    console.log("Done with all, writing file")
    return writeIssues()
  }
  // if there are no more issues to look through
  if (body.length === 0) {
    console.log("Done, moving on to " + nuxrepos[r])
    return nextRepo()
  }
  var issues = body
  // add some extra info to each issue
  issues.forEach(function(issue) {
    issue.parentrepo = nuxrepos[r]
    issue.pr = false
    if (issue.pull_request) issue.pr = true

    var labels = issue.labels
    // see if issue has one of our labels
    labels.forEach(function(label) {
      if (label.name === labelPrefix) {
        return relevant.push(issue)
      }
    })
  })
  // go the the next page of issues
  i++
  requestIssues(i, nuxrepos[r])
}

function filterIssues(err, resp, body) {
  if (err) console.log(err)

}
