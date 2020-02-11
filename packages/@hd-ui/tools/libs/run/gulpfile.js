const { getProjectPath, getConfig } = require('@hd-ui/shared-utils')
const gulp = require('gulp')
const babel = require('gulp-babel')
const webpack = require('webpack')
const rimraf = require('rimraf')
const through2 = require('through2')
const merge2 = require('merge2')
const ts = require('gulp-typescript')
const stripCode = require('gulp-strip-code')
const sourcemaps = require('gulp-sourcemaps')
const getBabelCommonConfig = require('../getBabelCommonConfig')
const transformLess = require('../transformLess')
const tsConfig = require('../getTSCommonConfig')()
const { cssInjection } = require('../utils/styleUtil')
const replaceLib = require('../replaceLib')

const tsDefaultReporter = ts.reporter.defaultReporter()
const cwd = process.cwd()
const libDir = getProjectPath('lib')
const esDir = getProjectPath('es')

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

function finalizeWebpack(err, stats) {
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
}

function webpackConfig() {
  const webpackConfig = require(getProjectPath('build', 'webpack.conf.js'))
  webpack(webpackConfig, finalizeWebpack)
}

function webpackCommon() {
  const webpackCommon = require(getProjectPath('build', 'webpack.common.js'))
  webpack(webpackCommon, finalizeWebpack)
}

function webpackComponent() {
  const webpackComponent = require(getProjectPath('build', 'webpack.component.js'))
  webpack(webpackComponent, finalizeWebpack)
}

gulp.task(
  'dist',
  gulp.series(done => {
    dist(done)
  }),
)

function babelify(js, modules) {
  const babelConfig = getBabelCommonConfig(modules)
  delete babelConfig.cacheDirectory
  if (modules === false) {
    babelConfig.plugins.push(replaceLib)
  }
  let stream = js
    .pipe(sourcemaps.init())
    .pipe(babel(babelConfig))
    .pipe(
      through2.obj(function z(file, encoding, next) {
        this.push(file.clone())
        if (file.path.match(/(\/|\\)style(\/|\\)index\.js/)) {
          const content = file.contents.toString(encoding)
          if (content.indexOf("'react-native'") !== -1) {
            // since we both split style/index.mative.js style/index.js
            // but let us keep this check at here
            // in case some of our developer made a file name mistake ==
            next()
            return
          }

          file.contents = Buffer.from(cssInjection(content))
          file.path = file.path.replace(/index\.js/, 'css.js')
          this.push(file)
          next()
        } else {
          next()
        }
      }),
    )
    .pipe(sourcemaps.write('.'))
  if (modules === false) {
    stream = stream.pipe(
      stripCode({
        start_comment: '@remove-on-es-build-begin',
        end_comment: '@remove-on-es-build-end',
      }),
    )
  }
  return stream.pipe(gulp.dest(modules === false ? esDir : libDir))
}

function compile(modules) {
  rimraf.sync(modules !== false ? libDir : esDir)
  const less = gulp
    .src(['components/**/*.less'])
    .pipe(
      through2.obj(function(file, encoding, next) {
        this.push(file.clone())
        if (
          file.path.match(/(\/|\\)style(\/|\\)index\.less$/) ||
          file.path.match(/(\/|\\)style(\/|\\)v2-compatible-reset\.less$/)
        ) {
          transformLess(file.path)
            .then(css => {
              file.contents = Buffer.from(css)
              file.path = file.path.replace(/\.less$/, '.css')
              this.push(file)
              next()
            })
            .catch(e => {
              console.error(e)
            })
        } else {
          next()
        }
      }),
    )
    .pipe(gulp.dest(modules === false ? esDir : libDir))
  const assets = gulp
    .src(['components/**/*.@(png|svg)'])
    .pipe(gulp.dest(modules === false ? esDir : libDir))
  let error = 0
  const source = ['components/**/*.tsx', 'components/**/*.ts', 'typings/**/*.d.ts']
  // allow jsx file in components/xxx/
  if (tsConfig.allowJs) {
    source.unshift('components/**/*.jsx')
  }
  const tsResult = gulp.src(source).pipe(
    ts(tsConfig, {
      error(e) {
        tsDefaultReporter.error(e)
        error = 1
      },
      finish: tsDefaultReporter.finish,
    }),
  )

  function check() {
    if (error && !argv['ignore-error']) {
      process.exit(1)
    }
  }

  tsResult.on('finish', check)
  tsResult.on('end', check)
  const tsFilesStream = babelify(tsResult.js, modules)
  const tsd = tsResult.dts.pipe(gulp.dest(modules === false ? esDir : libDir))
  return merge2([less, tsFilesStream, tsd, assets])
}

gulp.task('compile-with-es', done => {
  console.log('[Parallel] Compile to es...')
  compile(false).on('finish', done)
})

gulp.task('compile-with-lib', done => {
  console.log('[Parallel] Compile to js...')
  compile().on('finish', done)
})

gulp.task('compile-finalize', done => {
  // Additional process of compile finalize
  const { compile: { finalize } = {} } = getConfig()
  if (finalize) {
    console.log('[Compile] Finalization...')
    finalize()
  }
  done()
})

gulp.task(
  'compile',
  gulp.series(gulp.parallel('compile-with-es', 'compile-with-lib'), 'compile-finalize'),
)

function distReact(done) {
  rimraf.sync(getProjectPath('dist'))
  process.env.RUN_ENV = 'PRODUCTION'
  const webpackConfig = require(getProjectPath('webpack.config.js'))
  webpack(webpackConfig, (err, stats) => {
    finalizeWebpack(err, stats)

    // Additional process of dist finalize
    const { dist: { finalize } = {} } = getConfig()
    if (finalize) {
      console.log('[Dist] Finalization...')
      finalize()
    }

    done(0)
  })
}

gulp.task(
  'dist-react',
  gulp.series(done => {
    distReact(done)
  }),
)
