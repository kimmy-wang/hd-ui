const path = require('path')
const fs = require('fs')
const nodeExternals = require('webpack-node-externals')
const Components = require('../components.json')

const utilsList = fs.readdirSync(path.resolve(__dirname, '../src/utils'))
let externals = {}

Object.keys(Components).forEach(function(key) {
  externals[`hd-ui/components/${key}`] = `hd-ui/lib/${key}`
})

utilsList.forEach(function(file) {
  file = path.basename(file, '.js')
  externals[`hd-ui/src/utils/${file}`] = `hd-ui/lib/utils/${file}`
})

externals = [
  Object.assign(
    {
      vue: 'vue',
    },
    externals,
  ),
  nodeExternals(),
]

exports.externals = externals

exports.alias = {
  main: path.resolve(__dirname, '../src'),
  components: path.resolve(__dirname, '../components'),
  examples: path.resolve(__dirname, '../examples'),
  'hd-ui': path.resolve(__dirname, '../'),
}

exports.vue = {
  root: 'Vue',
  commonjs: 'vue',
  commonjs2: 'vue',
  amd: 'vue',
}

exports.jsexclude = /node_modules|utils\/popper\.js|utils\/date\.js/
