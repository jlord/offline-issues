#!/usr/bin/env node

var ghauth = require('ghauth')
var getIssues = require('./index.js')

var options = require('yargs')
  .usage('Usage: $0 [options] [repository ...]')
  .option('html', {
    alias: 'h',
    describe: 'If no repository given, generate HTML from existing offline cache',
    boolean: true
  })
  .option('no-static', {
    alias: 'S',
    describe: "Don't generate static files for HTML format",
    boolean: true
  })
  .option('state', {
    alias: 's',
    describe: 'Filter by issue state',
    choices: ['open', 'closed', 'all'],
    default: 'open'
  })
  .help('help')
  .argv

var ghAuthOptions = {
 // ~/.config/[configName].json will store the token
configName : 'offline-issues',
// (optional) whatever GitHub auth scopes you require
scopes     : [ 'repo' ],
// (optional) saved with the token on GitHub
note       : 'This token is for the offline-issues module from NPM'
}

ghauth(ghAuthOptions, function(err, token) {
  if (err) console.log(err)
  getIssues(token, options, function(err, message) {
    if (err) console.log(err, message)
    console.log(message)
  })

  // var token = { user: 'username',
  // token: 'TOKEN' }
})
