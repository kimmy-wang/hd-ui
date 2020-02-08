const { getProjectPath } = require('@hd-ui/shared-utils')
const gulp = require('gulp')
const fse = require('fs-extra')
const runCmd = require('../runCmd')

const lintIcon = () => done => {
  runCmd('node', ['build/bin/iconInit.js'], done)
}

const lintEntry = () => done => {
  runCmd('node', ['build/bin/build-entry.js'], done)
}

gulp.task('file', gulp.series(lintIcon(), lintEntry()))

const lintCss = () => done => {
  runCmd('node', ['build/bin/gen-cssfile.js'], done)
}

const lintTheme = () => done => {
  function copy() {
    fse.copySync(
      getProjectPath('components', 'theme-chalk', 'lib'),
      getProjectPath('lib', 'theme-chalk'),
    )
    done(0)
  }
  runCmd('gulp', ['build', '--gulpfile', 'components/theme-chalk/gulpfile.js'], copy)
}

gulp.task('theme', gulp.series(lintCss(), lintTheme()))

function utils(done) {
  console.log('utils...')
  done(0)
}

gulp.task(
  'utils',
  gulp.series(done => {
    utils(done)
  }),
)
