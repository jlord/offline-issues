var request = require('request')
var mkdirp =  require('mkdirp')
var fs = require('fs')

var base = 'https://api.github.com'

var headers = {"user-agent": "offline-issues module",}


// {
//   _: [ 'jlord/offline-issues', 'muan/github-gmail' ],
//   by: 'jlord',
//   all: true
// }

module.exports = function getIssues(token, options, cb) {
  if (!options._) return cb("No repository given.")
  parseRepo(options)

  headers["Authorization"] = 'token ' + opts.token

  // https://api.github.com/repos/github/

}


function parseRepo(options) {
  options.numberOf = options._.length
  options.repos = []

  options._.forEach(function(repo) {
    repo.full = repo
    var userAndRepo = repo.split('/')
    repo.user = userAndrepo[0]
    if (userAndRepo[1].indexOf('#') >= 0) {
      var repoAndIssue = userAndRepo[1].split('#')
      repo.name = repoAndIssue[0]
      repo.issue = repoAndIssue[1]
    } else { repo.name = userAndRepo[1] }
    options.repos.push(repo)
  })
  // do what's next
  // route off requests
  // makeRequest(options)
}

function makeRequest(options) {
  var query = '/issues?page='
  var limit = '&per_page=100'
  var pageNum = 1
  var url = base + '/repos/' + user + '/' + repo + query + pageNum + limit

  options.repos.forEach(function (repo) {
    request(url, {json: true, headers: headers}, filterIssues)
  })
}

// taken from other module, need to adapt
function getIssues(err, response, body) {
  if (err) console.log(err)
  // if there are no more repos to look through
  if (r === nuxrepos.length) {
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

function filterIssues(err, resp, me) {
  
}
