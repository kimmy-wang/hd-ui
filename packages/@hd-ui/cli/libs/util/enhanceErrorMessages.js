const program = require('commander')
const { chalk } = require('@hd-ui/shared-utils')

module.exports = (methodName, log) => {
  program.Command.prototype[methodName] = function(...args) {
    if (methodName === 'unknownOption' && this._allowUnknownOption) {
      return
    }
    this.outputHelp()
    console.log(`  ` + chalk.red(log(...args)))
    console.log()
    process.exit(1)
  }
}
