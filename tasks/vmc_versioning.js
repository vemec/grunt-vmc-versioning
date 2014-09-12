/*
 * grunt-vmc-versioning
 * https://github.com/vemec/grunt-vmc-versioning
 *
 * Copyright (c) 2014 Diego Ghersi
 * Licensed under the MIT license.
 */

'use strict';

// Libs
var crypto = require('crypto');
var chalk  = require('chalk');

module.exports = function(grunt) {

    grunt.registerMultiTask('vmc_versioning', 'Generate md5/sha1/sha256/sha512 hash based on the content of a file and append to it', function() {

        // Default options
        var options = this.options({
            config_output: true,                    // Default true
            config_wrap_name: 'versioned_files',    // Default versioned_files
            config_file: 'versioning_config.json',  // Default versioning_config.json
            config_dir: 'tmp',                      // Default tmp
            hash_length: 6,                         // Default 6
            algorithm: 'md5',                       // Default md5 - other options sha1/sha256/sha512
            encoding: 'utf8',                       // Default utf8
            prefix: ''                              // Default empty
        });

        // init output data
        var file_output = {};
        var file_cnt_created = 0;
        var file_cnt_rewritten = 0;

        grunt.log.writeln('Versioning files, run with --verbose for more details.');

        // Files...
        this.files.forEach( function (file) {
            if (!file.src.length) {
                return grunt.fail.warn('No source files were found.');
            }

            file.src.forEach( function (f) {
                if (grunt.file.isDir(f)) {
                  return;
                }

                // Generate hash based on file.
                var file_content = grunt.file.read(f, options.encoding);
                if (file_content.length === 0) {
                    grunt.log.warn('File ' + chalk.cyan(f) + ' is empty.');
                    return;
                }
                var hash = crypto.createHash(options.algorithm).update(file_content).digest('hex').substring(0, options.hash_length);

                // Get filename and extension
                var filename  = f.replace(/(.*)\//gi, '');
                var name      = getFileNameOrExtension(filename, 'name');
                var ext       = getFileNameOrExtension(filename, 'ext');
                var new_fname = name + '.' + (options.prefix ? options.prefix + '.'  : '') + hash + '.' + ext;

                var output_ext;
                if (ext == 'jpg' || ext == 'jpeg' || ext == 'gif' || ext == 'png' || ext == 'svg') {
                    output_ext = 'img'; }
                else {
                    output_ext = ext;
                };

                // Fill output data
                file_output['files'] = file_output['files'] || {};
                file_output['files'][output_ext] = file_output['files'][output_ext] || {};

                // duplicate flag
                var duplicate_found = false;
                filename.split(".").forEach( function (part) {
                    if (part === hash)
                    {
                        duplicate_found = true;
                        grunt.verbose.writeln(chalk.blue('The file content of ' + filename + ' generate the same hash ' + hash + ', avoiding rewrite.'));
                    }
                })

                if (!duplicate_found)
                {
                    file_cnt_created++;
                    // Found file
                    grunt.log.writeln('File ' + chalk.cyan(f) + ' found.');
                    var status_string = 'created';
                    if (grunt.file.exists(file.dest + '/' + new_fname))
                    {
                        file_cnt_rewritten++;
                        file_cnt_created--;
                        status_string = 'rewritten';
                    }

                    // create file
                    grunt.file.copy(f, file.dest + '/' + new_fname);
                    grunt.log.write('File ' + chalk.cyan(file.dest + '/' + new_fname) + ' ' + status_string + ' ').ok();

                    // json output
                    file_output['files'][output_ext][name + '.' + ext] = new_fname;
                }

            });

        });

        // cnt files.
        grunt.log.ok(chalk.green(file_cnt_created) + ' files versioned' + (file_cnt_rewritten > 0 ? ', '+ chalk.green(file_cnt_rewritten) + ' rewritten.' : '.' ));

        // Save JSON output file.
        if (options.config_output) {
            outputJSONFile(file_output, options.config_dir, options.config_wrap_name, options.config_file);
        }

    });

    /**
     * Get name and extension of a filename
     * @param  {string} File complete filename
     * @param  {string} Type output type 'name' | 'ext'
     * @return {string}
     */
    function getFileNameOrExtension(file, type)
    {
        var file_name = file.split(".");
        var result = '';
        if (type === 'name')
        {
            file_name.pop();
            result =  file_name.join('.');
        }
        else if(type === 'ext')
        {
            if(file_name.length === 1 || (file_name[0] === "" && file_name.length === 2))
            {
                result = "";
            }

            result = file_name.pop();
        }

        // return name
        return result;
    }

    /**
     * JSON config file
     * @param  {object} output      Files versions.
     * @param  {string} dest        Dest to save config file.
     * @param  {string} name_space  Name to wrap config content.
     * @param  {string} config_file Config file name.
     * @return {undefined}
     */
    function outputJSONFile(output, dest, name_space, config_file)
    {
        var obj = {};
        obj[name_space] = output;
        var json = JSON.stringify(obj, null, '\t');
        grunt.log.writeln();
        grunt.log.writeln('Saving JSON config file...');
        grunt.file.write(dest + '/' + config_file, json);
        grunt.log.ok('File ' + chalk.cyan(dest +'/'+ config_file) + ' created.');
    }

};