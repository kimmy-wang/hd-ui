#!/usr/bin/env node

'use strict'

require('colorful').colorful()
const runTask = require('../utils/task')
const program = require('commander')

program.on('--help', () => {
  console.log('  Usage:'.to.bold.blue.color)
  console.log()
})

program.parse(process.argv)

const task = program.args[0]

if (!task) {
  program.help()
} else {
  console.log('hd-ui-tools build', task)

  require('../build/gulpfile')

  runTask(task)
}
