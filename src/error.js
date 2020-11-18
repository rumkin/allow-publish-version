
class ApvError extends Error {
  static code = ''

  constructor(detail = {}) {
    super('')
    this.name = this.constructor.name
    this.code = this.constructor.code
    this.message = this.constructor.message || this.format(detail)
    this.detail = detail
  }

  format() {
    throw new Error('Not implemented')
  }
}

class ApvTypeError extends TypeError {
  static code = ''

  constructor(detail = {}) {
    super('')
    this.name = this.constructor.name
    this.code = this.constructor.code
    this.message = this.constructor.message || this.format(detail)
    this.detail = detail
  }

  format() {
    throw new Error('Not implemented')
  }
}

class PkgDirectiveTypeError extends ApvTypeError {
  static code = 'ALLPUBVER/PKG_DIRECTIVE_TYPE'
  static message = 'Package directive `allowPublishVersion` is not an object.'
}

class PrereleaseError extends ApvError {
  static code = 'ALLPUBVER/PRERELEASE'
  format({prerelease}) {
    return `Prerelease "${prerelease}" is not allowed.`
  }
}

class PrereleaseIndexError extends ApvError {
  static code = 'ALLPUBVER/PRERELEASEE_INDEX'
  format({index}) {
    return `Prerelease index "${index}" is not allowed.`
  }
}

class VersionFormatError extends ApvError {
  static code = 'ALLPUBVER/VERSION_FORMAT'
  format({version}) {
    return `Bad version "${version}" format.`
  }
}

exports.PkgDirectiveTypeError = PkgDirectiveTypeError
exports.PrereleaseError = PrereleaseError
exports.PrereleaseIndexError = PrereleaseIndexError
exports.VersionFormatError = VersionFormatError
