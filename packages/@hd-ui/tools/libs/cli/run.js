#!/usr/bin/env node

'use strict'

require('colorful').colorful()
const runTask = require('../utils/task')
const program = require('commander')

program
  .usage('[options]')
  .option(
    '-l, --lang <langName>',
    'Specify the language type when packaging. (optional: vue or react, default: vue)',
    'vue',
  )

program.on('--help', () => {
  console.log('  Usage:'.to.bold.blue.color)
  console.log()
})

program.parse(process.argv)

let task = program.args[0]

const lang = program.lang

if (!task) {
  program.help()
} else {
  if (lang && lang === 'react') {
    task = `${task}-${lang}`
  }

  console.log('hd-ui-tools run', task)

  require('../run/gulpfile')

  runTask(task)
}
