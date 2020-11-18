#!/usr/bin/env node
const path = require('path')

const {check, checkDirective} = require('..')

main()
.then((code) => process.exit(code))

function main() {
  const DEBUG = process.env.DEBUG === '1'
  const pkg = require(path.join(process.cwd(), 'package.json'))

  return whilst(pkg, [
    execArgvCheck,
    execPkgDirectiveCheck,
  ])
  .then((result) => result.exitCode)
  .catch(err => {
    if ((err.code || '').startsWith('ALLPUBVER/') && !DEBUG) {
      console.error(err.message)
    }
    else {
      console.error(err)
    }

    return 1
  })
}

function execArgvCheck(pkg) {
  const args = process.argv.slice(2)

  if (!args.length) {
    return
  }

  check(pkg, args)

  return {exitCode: 0}
}

function execPkgDirectiveCheck(pkg) {
  checkDirective(pkg)

  return {exitCode: 0}
}

async function whilst(context, fns) {
  for (const fn of fns) {
    const result = await fn(context)
    if (result) {
      return result
    }
  }
}
