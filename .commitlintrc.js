const fs = require('fs')
const path = require('path')

const HdUiPackages = fs.readdirSync(path.resolve(__dirname, 'packages/@hd-ui'))

module.exports = {
  extends: [
    '@commitlint/config-conventional'
  ],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'docs',
        'hd-ui',
        'hd-ui-example',
        ...HdUiPackages
      ].map(name => `$${name}`)
    ]
  }
}
