const fse = require('fs-extra')
const path = require('path')
const examples = require('../examples/examples.json')

const copyFuns = []

const allExamples = {}
Object.keys(examples).forEach(function(key) {
  const exampleByLang = examples[key]
  if (exampleByLang) {
    Object.keys(exampleByLang).forEach(function(keyLang) {
      allExamples[`${key}-${keyLang}`] = exampleByLang[keyLang]
    })
  }
})

console.log(allExamples)

Object.keys(allExamples).forEach(function(key) {
  const src = path.resolve(__dirname, `${allExamples[key]['url']}/dist`)
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
        .copy(src, dest)
        .then(() => resolve(`${key} success.`))
        .catch(err => reject(`${key} ${err}.`))
    }),
  )
})

copyFuns.length &&
  Promise.all(copyFuns)
    .then(console.log)
    .catch(console.error)
