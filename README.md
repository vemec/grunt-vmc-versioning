# grunt-vmc-versioning v0.2.4
[![Build Status](https://travis-ci.org/vemec/grunt-vmc-versioning.svg?branch=master)](https://travis-ci.org/vemec/grunt-vmc-versioning) [![Dependency Status](https://david-dm.org/vemec/grunt-vmc-versioning.svg)](https://david-dm.org/vemec/grunt-vmc-versioning)

> Generate md5/sha1/sha256/sha512 hash based on the content of a file and append to it. Versioning static assets with Grunt.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-vmc-versioning --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-vmc-versioning');
```

## The "vmc_versioning" task

### Overview
In your project's Gruntfile, add a section named `vmc_versioning` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  vmc_versioning: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.configOutput
Type: `Boolean`
Default value: `'true'`

Output JSON file.

#### options.configWrapName
Type: `String`
Default value: `'versioned_files'`

A string value that is used to set a wrapper name to the JSON output file.

#### options.configFile
Type: `String`
Default value: `'versioning_config.json'`

JSON output file name.

#### options.configDir
Type: `String`
Default value: `'tmp'`

A dir to save the JSON config file.

#### options.hashLength
Type: `String`
Default value: `'tmp'`

Hash length

#### options.algorithm
Type: `String`
Default value: `'md5'`

`algorithm` is dependent on the available algorithms supported by the version of OpenSSL on the platform. Examples are `'sha1'`, `'md5'`, `'sha256'`, `'sha512'`, etc. On recent releases, `openssl list-message-digest-algorithms` will display the available digest algorithms.


#### options.prefix
Type: `String`
Default value: `''`

Add a prefix to a file such as `master.[ PREFIX ].[ HASH ].css`


#### options.encoding
Type: `String`
Default value: `'utf8'`

Encoding type


#### options.replaceCssImgs
Type: `Boolean`
Default value: `'false'`

Find and replace the name of the versioned images using the JSON output file in all the CSS files find in the directory with the option: `'options.cssDir'`.


#### options.cssDir
Type: `String`
Default value: `''`

Css dir.


### JSON output file example (Optional)
```json
{
  "versioned_test_files": {
    "files": {
      "css": {
        "main.css": "main.VMC.1bd4295b.css"
      },
      "js": {
        "script.js": "script.VMC.974b3c8c.js"
      },
      "img": {
        "grunt-logo.png": "grunt-logo.VMC.eea94bb7.png"
      }
    }
  }
}
```

### Usage Examples

```js
grunt.initConfig({
  vmc_versioning: {
    options: {
      config_wrap_name: 'versioned_test_files',
      config_file: 'version_test_config.json',
      config_dir: 'tmp',
      version_length: 8,
      algorithm: 'md5',
      prefix: '<%= pkg.version %>'
    },
    dest: {
      files: [{
          cwd: 'test/files/',
          src: '**/*.{png,jpg,gif,css,js}',
          dest: 'tmp',
          expand: true
      }],
    }
  }
});
```

## Release History
- 2015-05-08 0.2.4 Less verbose output.
- 2015-05-06 0.2.3 Use dynamic mappings for files.
- 2015-05-05 0.2.2 Now use `'grunt.file.expand'` to find all CSS files.
- 2015-04-29 0.2.1 Small fix in hardcoded property.
- 2015-04-29 0.2.0 Find and replace the name of the versioned images in the CSS.
- 2015-02-27 0.1.9 Update dependencies.
- 2015-01-16 0.1.8 Removed delete option, not a good idea, options changed to camelCase.
- 2015-01-16 0.1.7 Add new option to delete files in dest.
- 2015-01-14 0.1.6 Fixed some jshint errors.
- 2014-08-10 0.1.5 Change the JSON output file.
- 2014-08-07 0.1.4 Enhancements.
- 2014-08-06 0.1.3 Enhancements and fixes.
- 2014-08-03 0.1.2 Bug fixes.
- 2014-08-03 0.1.0 Initial release.

## License
Copyright (c) 2014 Diego Ghersi

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

## Author
[Diego Ghersi](https://github.com/vemec) [@vemec](https://twitter.com/vemec)
