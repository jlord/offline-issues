var request = require('request')
var mkdirp =  require('mkdirp')
var fs = require('fs')

var base = 'https://api.github.com'
var headers = {"user-agent": "offline-issues module",}

var issueData = []
var counter = 1
var done = ''

module.exports = function getIssues(token, options, cb) {
  if (!options._) return cb("No repository given.")

  parseRepo(options)
  headers["Authorization"] = 'token ' + token.token
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
    if (err) return console.log(err)
    loadIssue(body, repo)
  })
}

function loadIssue(body, repo) {
  var issue = {}

  // issue.id = body.id
  // issue.url = body.html_url
  // issue.title = body.title
  // issue.createdBy = body.user.login
  // issue.createdOn = body.created_at
  // issue.body = body.body
  // issue.state = body.state
  // issue.comments = []

  issue[body.id]= {}
  issue[body.id].url = body.html_url
  issue[body.id].title = body.title
  issue[body.id].createdBy = body.user.login
  issue[body.id].createdOn = body.created_at
  issue[body.id].body = body.body
  issue[body.id].state = body.state

  getComments(issue, repo)
}

function getComments(issue, repo) {
  var url = base + '/repos/' + repo.user + '/' + repo.name + '/issues/' + repo.issue + '/comments'

  request(url, {json: true, headers: headers}, function(err, resp, body) {
    if (err) return console.log(err)

    var id = Object.keys(issue)[0]
    issue[id].comments = body
    issueData.push(issue)

    if (counter === done) {
      writeData()
    } else counter++
  })
}

function writeData() {
  console.log('writing data')
  var data = JSON.stringify(issueData, null, ' ')
  fs.writeFile('comments.json', data, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
})
}

// function buildQuery(options) {
//   var issuesAll = ''
//   var issuesClosed = ''
//   var issuesOpen = ''
//   var author = ''
//   var labels = ''
//
//   options.repos.forEach(function(repo) {
//     if (options.by) repo.author = '?creator=' + options.by
//     if (options.l) repo.labels = '?labels=' + options.l
//     if (options.all) repo.state = '?state=all'
//     if (options.o) repo.state = '?state=open'
//     if (options.c) repo.state = '?state=closed'
//   })
//
// }

// function makeRequest(i, options) {
//   var query = '/issues?page='
//   var limit = '&per_page=100'
//
//   options.repos.forEach(function (repo) {
//     var url = base + '/repos/' + repo.user + '/' + repo.name + query + pageNum + limit
//     console.log("URL", url)
//     // request(url, {json: true, headers: headers}, getIssues)
//   })
// }
//
// // taken from other module, need to adapt
// function getIssues(err, response, body) {
//   if (err) console.log(err)
//   // if there are no more repos to look through
//   if (repoNum === nuxrepos.length) {
//     console.log("Done with all, writing file")
//     return writeIssues()
//   }
//   // if there are no more issues to look through
//   if (body.length === 0) {
//     console.log("Done, moving on to " + nuxrepos[r])
//     return nextRepo()
//   }
//   var issues = body
//   // add some extra info to each issue
//   issues.forEach(function(issue) {
//     issue.parentrepo = nuxrepos[r]
//     issue.pr = false
//     if (issue.pull_request) issue.pr = true
//
//     var labels = issue.labels
//     // see if issue has one of our labels
//     labels.forEach(function(label) {
//       if (label.name === labelPrefix) {
//         return relevant.push(issue)
//       }
//     })
//   })
//   // go the the next page of issues
//   i++
//   requestIssues(i, nuxrepos[r])
// }
//
// function filterIssues(err, resp, body) {
//   if (err) console.log(err)
//
// }
