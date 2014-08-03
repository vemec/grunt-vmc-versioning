# grunt-vmc-versioning

> Generate md5/sha1/sha256/sha512 hash based on the content of a file and append to it.

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


prefix

#### options.config_wrap_name
Type: `String`
Default value: `'versioned_files'`

A string value that is used to set a wrapper name.

#### options.config_file
Type: `String`
Default value: `'versioning_config.json'`

JSON file name.

#### options.config_dir
Type: `String`
Default value: `'tmp'`

A dir to save the config file JSON.

#### options.hash_length
Type: `String`
Default value: `'tmp'`

Hash length

#### options.algorithm
Type: `String`
Default value: `'md5'`

Algoritm `md5/sha1/sha256/sha512`

#### options.prefix
Type: `String`
Default value: `''`

A prefix to output file.

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  vmc_versioning: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

## Release History
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