/*
 * grunt-vmc-versioning
 * https://github.com/vemec/grunt-vmc-versioning
 *
 * Copyright (c) 2015 Diego Ghersi
 * Licensed under the MIT license.
 */

'use strict';

// Libs
var crypto = require('crypto');
var chalk  = require('chalk');

module.exports = function(grunt) {

    grunt.registerMultiTask('vmc_versioning', 'Generate md5/sha1/sha256/sha512 hash based on the content of a file and append to it. Versioning static assets with Grunt.', function() {

        // Default options
        var options = this.options({
            configOutput: true,                   // Default true
            configWrapName: 'versioned_files',    // Default versioned_files
            configFile: 'versioning_config.json', // Default versioning_config.json
            configDir: 'tmp',                     // Default tmp
            replaceCssImgs: false,                // Default false
            cssDir: '',                           // Default empty
            hashLength: 6,                        // Default 6
            algorithm: 'md5',                     // Default md5 - other options sha1/sha256/sha512
            encoding: 'utf8',                     // Default utf8
            prefix: ''                            // Default empty
        });

        // init output data
        var file_output = {};
        var file_cnt_created = 0;
        var file_cnt_rewritten = 0;

        grunt.log.writeln('Versioning files, run with --verbose for more details.');

        // check old config file an get content
        var old_configFile = false;
        if (options.configOutput)
        {
            if (grunt.file.exists(options.configDir + '/' + options.configFile)) {
                old_configFile = grunt.file.readJSON(options.configDir + '/' + options.configFile);
            }
        }

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
                var hash = crypto.createHash(options.algorithm).update(file_content).digest('hex').substring(0, options.hashLength);

                // Get filename and extension
                var filename  = f.replace(/(.*)\//gi, '');
                var name      = getFileNameOrExtension(filename, 'name');
                var ext       = getFileNameOrExtension(filename, 'ext');
                var new_fname = name + '.' + (options.prefix ? options.prefix + '.'  : '') + hash + '.' + ext;

                var output_ext;
                if (ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'png' || ext === 'svg') {
                    output_ext = 'img'; }
                else {
                    output_ext = ext;
                }

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
                });

                if (!duplicate_found)
                {
                    file_cnt_created++;
                    // Found file
                    grunt.verbose.writeln('File ' + chalk.cyan(f) + ' found.');
                    var status_string = 'created';
                    if (grunt.file.exists(file.dest + '/' + new_fname))
                    {
                        file_cnt_rewritten++;
                        file_cnt_created--;
                        status_string = 'skipped';
                    }

                    // create file
                    grunt.file.copy(f, file.dest + '/' + new_fname);
                    if (status_string === 'skipped' ) {
                        grunt.verbose.writeln('File ' + chalk.cyan(file.dest + '/' + new_fname) + ' ' + status_string + ' ');
                    }
                    else {
                        grunt.log.write('File ' + chalk.cyan(file.dest + '/' + new_fname) + ' ' + status_string + ' ').ok();
                    }

                    // json output
                    file_output['files'][output_ext][name + '.' + ext] = new_fname;
                }

            });

        });

        // cnt files.
        grunt.log.ok(chalk.green(file_cnt_created) + ' files versioned' + (file_cnt_rewritten > 0 ? ', '+ chalk.green(file_cnt_rewritten) + ' skipped.' : '.' ));

        // Save JSON output file.
        if (file_cnt_created > 0)
        {
            if (options.configOutput) {
                outputJSONFile(file_output, options.configDir, options.configWrapName, options.configFile);
            }

            // replace versioning images on CSS file.
            if (options.replaceCssImgs && options.configOutput)
            {
                if (options.cssDir)
                {
                    // read and get json file
                    var json_content = grunt.file.readJSON(options.configDir + '/' + options.configFile);

                    // src config
                    var src = [
                       options.cssDir + '/**/*.css'
                    ];

                    // read every css file
                    grunt.file.expand({ filter: 'isFile'}, src).forEach( function(css_file) {

                        // get css content
                        var css_content = grunt.file.read(css_file, options.encoding);
                        grunt.log.ok('Replacing imgs on CSS file: ' + chalk.cyan(css_file));
                        grunt.verbose.writeln();

                        // search and replace images in the CSS
                        for(var img in json_content[options.configWrapName]['files']['img']) {
                            css_content = css_content.replace(new RegExp(img, 'gi'), json_content[options.configWrapName]['files']['img'][img]);
                        }

                        // write file
                        grunt.file.write(css_file, css_content);
                        grunt.log.ok('Replacing imgs for ' + chalk.cyan(css_file) + ' complete.');

                    });
                }
                else
                {
                    // warning
                    grunt.log.warn('replaceCssImgs is set to be true, but cssDir is empty.');
                    return;
                }
            }
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
     * @param  {string} configFile  Config file name.
     * @return {undefined}
     */
    function outputJSONFile(output, dest, name_space, configFile)
    {
        var obj = {};
        obj[name_space] = output;
        var json = JSON.stringify(obj, null, '\t');
        grunt.log.writeln();
        grunt.log.writeln('Saving JSON config file...');
        grunt.file.write(dest + '/' + configFile, json);
        grunt.log.ok('File ' + chalk.cyan(dest +'/'+ configFile) + ' created.');
    }

};
