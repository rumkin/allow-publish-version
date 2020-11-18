# Allow Publish Version

Allow Publish Version util protects your NPM package from being accidentally
published with invalid version. Use it with `prepublishOnly` script of package.json.

It will check your package version to be valid NPM subset of [semver](https://semver.org)
with exact prerelease record. Valid versions might look like `1.0.0` or `1.0.0-beta.1`.

## Installation

```bash
npm i allow-publish-version
```

## Usage

1. Add `prepublishOnly` script in `package.json`.
3. Run `npm publish` when you're ready to publish your package, or `npm publish --dry-run` to test.

Example `package.json`:
```js
{
  "version" : "1.0.0-alpha.1",
  "scripts": {
    "prepublishOnly": "allow-publish-version"
  },
}
```

By default there will be `alpha`, `beta` and `rc` prereleases allowed.

## Examples

Valid versions:

```text
1.0.0
1.0.0-pre.1
1.0.0-pre.beta.1
```

Invalid versions:

```ini
1.0 # Not a valid semver.
1.0.0-beta # No prerelease version.
1.0.0-pre.0 # Prerelease index should start from 1.
1.0.0-pre.1.0 # Prerelease name couldn't contain numbers.
1.0.0-beta.0+x64 # Builds are not supported by NPM.
```

## Configuration

APV could be configured to use another prerelease scheme with `package.json`.

```js
{
  "version" : "1.0.0-nightly.1",
  "scripts": {
    "prepublishOnly": "allow-publish-version"
  },
  "allowPublishVersion": {
    "prereleases": ["nightly", "beta"]
  }
}
```

## API

### `AllowPublishVersionRecord`

```text
AllowPublishVersionFlag | AllowPublishVersionList | AllowPublishVersionDict
```

Configuration value `AllowPublishVersionRecord` describes the value of `allowPublishVersion` field of `package.json`.

### `AllowPublishVersionFlag`

```text
true
```

Boolean value `true` turns default APV configuration on.

Example:

```js
{
  "allowPublishVersion": true
}
```

### `AllowPublishVersionList`

```text
Array<string>
```

Array should contain allowed prerelease names or [picomatch](https://npmjs.com/package/picomatch)-compatible glob patterns.

Example:

```js
{
  "allowPublishVersion": ["beta", "pre.*"]
}
```

### `AllowPublishVersionDict`

```text
{
  prereleases: Array<string>
}
```

Dictionary holds single field `prereleases`. This field contains allowed prerelease names or [picomatch](https://npmjs.com/package/picomatch)-compatible glob patterns.

Example:

```js
{
  "allowPublishVersion": {
    "prereleases": ["beta", "pre.*"]
  }
}
```

## License

MIT.
