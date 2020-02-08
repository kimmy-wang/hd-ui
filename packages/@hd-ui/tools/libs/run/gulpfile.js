const { getProjectPath } = require('@hd-ui/shared-utils')
const gulp = require('gulp')
const webpack = require('webpack')
const rimraf = require('rimraf')

gulp.task('clean', () => {
  rimraf.sync('lib')
  rimraf.sync('components/*/lib')
  rimraf.sync('test/**/coverage')
})

function dist(done) {
  webpackConfig()
  webpackCommon()
  webpackComponent()
  done(0)
}

function webpackConfig() {
  const webpackConfig = require(getProjectPath('build', 'webpack.conf.js'))
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) {
        console.error(err.details)
      }
      return
    }

    const info = stats.toJson()

    if (stats.hasErrors()) {
      console.error(info.errors)
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings)
    }

    const buildInfo = stats.toString({
      colors: true,
      children: true,
      chunks: false,
      modules: false,
      chunkModules: false,
      hash: false,
      version: false,
    })
    console.log(buildInfo)
  })
}

function webpackCommon() {
  const webpackCommon = require(getProjectPath('build', 'webpack.common.js'))
  webpack(webpackCommon, (err, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) {
        console.error(err.details)
      }
      return
    }

    const info = stats.toJson()

    if (stats.hasErrors()) {
      console.error(info.errors)
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings)
    }

    const buildInfo = stats.toString({
      colors: true,
      children: true,
      chunks: false,
      modules: false,
      chunkModules: false,
      hash: false,
      version: false,
    })
    console.log(buildInfo)
  })
}

function webpackComponent() {
  const webpackComponent = require(getProjectPath('build', 'webpack.component.js'))
  webpack(webpackComponent, (err, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) {
        console.error(err.details)
      }
      return
    }

    const info = stats.toJson()

    if (stats.hasErrors()) {
      console.error(info.errors)
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings)
    }

    const buildInfo = stats.toString({
      colors: true,
      children: true,
      chunks: false,
      modules: false,
      chunkModules: false,
      hash: false,
      version: false,
    })
    console.log(buildInfo)
  })
}

gulp.task(
  'dist',
  gulp.series(done => {
    dist(done)
  }),
)
