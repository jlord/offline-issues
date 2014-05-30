#!/usr/bin/env node

var ghauth = require('ghauth')
var minimist = require('minimist')
var getIssues = require('./index.js')

var options = minimist(process.argv.slice(2));

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
