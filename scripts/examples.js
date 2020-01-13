const fse = require('fs-extra')
const path = require('path')
const examples = require('../examples/examples.json')

const copyFuns = []

Object.keys(examples).forEach(function(key) {
  const src = path.resolve(__dirname, `${examples[key]}/dist`)
  const dest = path.resolve(__dirname, `../examples/${key}`)
  if (!fse.pathExistsSync(src)) {
    console.error(`Error: no such file or directory, ${src}.`)
    return
  }
  if (fse.pathExistsSync(dest)) {
    const result = fse.removeSync(dest)
    console.log('result', result, dest)
  }
  copyFuns.push(
    new Promise((resolve, reject) => {
      fse
        .copy(
          path.resolve(__dirname, `${examples[key]}/dist`),
          path.resolve(__dirname, `../examples/${key}`),
        )
        .then(() => resolve(`${key} success.`))
        .catch(err => reject(`${key} ${err}.`))
    }),
  )
})

copyFuns.length &&
  Promise.all(copyFuns)
    .then(console.log)
    .catch(console.error)
