# offline-issues

Get your GitHub Issues offline. Select the **user/org**, **repo/s**, **label/s** or **number/s**.

#### Example

`offline-issues -a jlord -r offline-issues -l bug -all`

#### Options

- `-a <ACCOUNT>` this can be a user or organization (ie 'jlord' or 'github')
- `-r <REPO> <REPO>` this is the name of each repo you'd like, separated by a space
- `no <NUMBER>` the number of an issue, only when requesting one repo
- `-o` for all open issues
- `-c` for all closed issues
- `-all`for all issues closed and open
- `-l <LABEL> <LABEL>` one or more labels, will search for these in each repo
- `by <USER> <USER>` for issues created by one or more accounts
