/*
 * grunt-vmc-versioning
 * https://github.com/vemec/grunt-vmc-versioning
 *
 * Copyright (c) 2015 Diego Ghersi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // read package.json
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    vmc_versioning: {
      options: {
        configWrapName: 'versioned_test_files',
        configFile: 'version_test_config.json',
        configDir: 'tmp',
        hashLength: 8,
        algorithm: 'md5', // - other options sha1/sha256/sha512
        prefix: 'VMC',
        replaceCssImgs: true,
        cssDir: 'tmp/css'
      },
      dest: {
        files: {
          'tmp/css': ['test/files/*.css'],
          'tmp/js': ['test/files/*.js'],
          'tmp/img': ['test/files/*.{jpg,jpeg,gif,png}']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'vmc_versioning']);

  grunt.registerTask('ver', ['vmc_versioning']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
