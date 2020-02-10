const request = require('request')
const { semver, chalk } = require('@hd-ui/shared-utils')
const packageConfig = require('../package.json')

module.exports = done => {
  // Ensure minimum supported node version is used
  if (!semver.satisfies(process.version, packageConfig.engines.node)) {
    return console.log(
      chalk.red(
        '  You must upgrade node to >=' + packageConfig.engines.node + '.x to use @hd-ui/cli',
      ),
    )
  }

  request(
    {
      url: 'https://registry.npmjs.org/@hd-ui/cli',
      timeout: 1000,
    },
    (err, res, body) => {
      if (!err && res.statusCode === 200) {
        const latestVersion = JSON.parse(body)['dist-tags'].latest
        const localVersion = packageConfig.version
        if (semver.lt(localVersion, latestVersion)) {
          console.log(chalk.yellow('  A newer version of @hd-ui/cli is available.'))
          console.log()
          console.log('  latest:    ' + chalk.green(latestVersion))
          console.log('  installed: ' + chalk.red(localVersion))
          console.log()
        }
      }
      done()
    },
  )
}
