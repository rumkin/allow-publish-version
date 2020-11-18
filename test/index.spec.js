const assert = require('assert')
const path = require('path')
const {spawnSync} = require('child_process')

const {check, checkDirective} = require('..')

assert.ok(check({version: '1.0.0'}, ['']), 'Version has no flag. No tag provided')
assert.ok(check({version: '1.0.0'}, ['beta']), 'Version has no flag. Provided tag not allowed')
assert.ok(check({version: '1.0.0-alpha.1'}, ['alpha']), 'Version has flag. Provided tag is allowed')
assert.ok(check({version: '1.0.0-pre.alpha.1'}, ['pre.*']), 'Version has flag. Provided tag is allowed')
assert.throws(() => check({version: '1.0.0-alpha'}, ['next']), {
  name: 'VersionFormatError',
}, 'Version "1.0.0-alpha" has invalid format')
assert.throws(() => check({version: '1.0.0-alpha.1.1'}, ['alpha']), {
  name: 'VersionFormatError',
}, 'Version has flag. Provided tag is not allowed')
assert.throws(() => check({version: '1.0.0-alpha.0'}, ['alpha']), {
  name: 'PrereleaseIndexError',
}, 'Version has flag. Provided tag is not allowed')
assert.throws(() => check({version: '1.0.0-alpha.1'}, ['nightly', 'beta']), {
  name: 'PrereleaseError',
  detail: {prerelease: 'alpha'},
}, 'Version has flag. Provided tag is not allowed')

assert.ok(checkDirective({
  version: '1.0.0-beta.1',
}), 'Allow release "beta" without allowPublishVersion directive')

assert.ok(checkDirective({
  version: '1.0.0-beta.1',
  allowPublishVersion: true,
}), 'Allow release "beta" without allowPublishVersion directive')

assert.ok(checkDirective({
  version: '1.0.0-nightly.1',
  allowPublishVersion: ['nightly'],
}), 'Allow release "beta" without allowPublishVersion directive')

assert.ok(checkDirective({
  version: '1.0.0-nightly.1',
  allowPublishVersion: {
    prereleases: ['nightly'],
  },
}), 'Allow release "beta" without allowPublishVersion directive')

assert.throws(() => checkDirective({
  version: '1.0.0-beta.1',
  allowPublishVersion: null,
}), {
  code: 'ALLPUBVER/PKG_DIRECTIVE_TYPE',
  name: 'PkgDirectiveTypeError',
}, 'Thows PkgDirectiveTypeError if package.json#allowPublishVersion is not a plain object')

assertMatch(runBin('fixtures/release'), {
  stderr: '',
  status: 0,
}, 'Binary exits with 0 with `1.0.0` version and no config')

assertMatch(runBin('fixtures/beta'), {
  stderr: '',
  status: 0,
}, 'Binary exits with 0 with `1.0.0-beta.1` version and no config')

assertMatch(runBin('fixtures/nightly'), {
  stderr: 'Prerelease "nightly" is not allowed.\n',
  status: 1,
}, 'Binary exits with 0 with `1.0.0-nightly.1` version and no config')

assertMatch(runBin('fixtures/nightly', ['nightly']), {
  stderr: '',
  status: 0,
}, 'Binary exits with 0 with `1.0.0-nightly.1` version and no config')

function runBin(cwd, args = [], env = {}) {
  const result = spawnSync('node', [path.join(__dirname, '../bin/cli.js'), ...args], {
    cwd: path.join(__dirname, cwd),
    env: {
      ...process.env,
      ...env,
    },
  })

  return {
    ...result,
    stdout: result.stdout ? result.stdout.toString('utf8') : '',
    stderr: result.stderr ? result.stderr.toString('utf8') : '',
  }
}

function assertMatch(a, b, message) {
  for (const [key, value] of Object.entries(b)) {
    assert.strictEqual(a[key], value, `Key "${key}": ${message}`)
  }
}
