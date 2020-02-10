#!/usr/bin/env node

const logger = require('../libs/logger')
const request = require('request')
const { chalk } = require('@hd-ui/shared-utils')

/**
 * Padding.
 */

console.log()
process.on('exit', () => {
  console.log()
})

/**
 * List repos.
 */

request(
  {
    url: 'https://api.github.com/users/hd-ui-templates/repos',
    headers: {
      'User-Agent': '@hd-ui/cli',
    },
  },
  (err, res, body) => {
    if (err) logger.fatal(err)
    const requestBody = JSON.parse(body)
    if (Array.isArray(requestBody)) {
      console.log('  Available official templates:')
      console.log()
      requestBody.forEach(repo => {
        console.log(
          '  ' + chalk.yellow('★') + '  ' + chalk.blue(repo.name) + ' - ' + repo.description,
        )
      })
    } else {
      console.error(requestBody.message)
    }
  },
)
