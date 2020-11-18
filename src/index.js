const isPlainObject = require('lodash.isplainobject')
const picomatch = require('picomatch')
const semver = require('semver')

const {PrereleaseError, PkgDirectiveTypeError, VersionFormatError, PrereleaseIndexError} = require('./error')

const defaultPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-[a-z]+(\.[a-z]+)*(\.(0|[1-9]\d*)))?$/
const defaultPrereleases = ['alpha', 'beta', 'rc']

const defaultOptions = {
  pattern: defaultPattern,
  prereleases: defaultPrereleases,
}

function check(pkg, allowed) {
  const {version} = pkg
  if (!defaultPattern.test(version)) {
    throw new VersionFormatError({
      version,
    })
  }

  const prerelease = getPrerelease(version)

  if (prerelease) {
    if (prerelease.index < 1) {
      throw new PrereleaseIndexError({
        index: prerelease.index,
      })
    }
    if (!matchPrerelease(allowed, prerelease.label)) {
      throw new PrereleaseError({
        prerelease: prerelease.label,
      })
    }
  }

  return true
}

function checkDirective(pkg) {
  const pkgOptions = 'allowPublishVersion' in pkg ? pkg.allowPublishVersion : true
  let options
  if (pkgOptions === true) {
    options = defaultOptions
  }
  else if (Array.isArray(pkgOptions)) {
    options = {
      pattern: defaultPattern,
      prereleases: pkgOptions,
    }
  }
  else if (isPlainObject(pkgOptions)) {
    options = {
      pattern: pkgOptions.pattern ? new RegExp(pkgOptions.pattern) : defaultPattern,
      prereleases: pkgOptions.prereleases ? pkgOptions.prereleases : defaultPrereleases,
    }
  }
  else {
    throw new PkgDirectiveTypeError()
  }

  return check(pkg, options.prereleases)
}

function matchPrerelease(list, prerelease) {
  for (const item of list) {
    const matcher = picomatch(item)

    if (matcher(prerelease)) {
      return true
    }
  }

  return false
}

function getPrerelease(version) {
  const parsed = semver.parse(version)

  if (parsed && parsed.prerelease.length) {
    const {prerelease} = parsed

    return {
      label: prerelease.slice(0, -1).join('.'),
      index: prerelease[prerelease.length - 1],
    }
  }
  else {
    return null
  }
}

exports.check = check
exports.checkDirective = checkDirective
