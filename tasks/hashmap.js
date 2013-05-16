/*
 * grunt-sea-hashmap
 * https://github.com/xsbear/grunt-sea-hashmap
 *
 * Copyright (c) 2013 HuangWenping
 * Licensed under the MIT license.
 */

'use strict';

var crypto = require('crypto');
var path = require('path');
var fs = require('fs');

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('hashmap', 'Your task description goes here.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            algorithm: 'md5',
            encoding: 'utf8',
            map_tpl: path.join(__dirname, 'map.tpl'),
            MAP_BLOCK_RE: /\/\*map start\*\/[\s\S]*\/\*map end\*\//,
            MAP_FILE_RE: /[^"]+\?\w+/g,
        });

        var done = this.async();

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            if (!f.dest) {
                grunt.log.error('Dest map file does not specified');
                return false;
            }
            var encoding = options.encoding;
            var cwd = f.cwd;
            var mapping = [];
            var originMapping = {};
            var dest = f.dest;
            var MAP_TPL = grunt.file.read(options.map_tpl);

            if (options.build_dest && grunt.file.exists(dest)) {
                var mapContents = fs.readFileSync(dest, encoding);
                var hashArr = mapContents.match(options.MAP_FILE_RE);
                if(hashArr !== null){
                    for (var i = hashArr.length - 1; i >= 0; i--) {
                        var item = hashArr[i].split('?');
                        originMapping[item[0]] = item[1];
                    }
                }
            }

            var src = f.src.filter(function(filepath) {
                filepath = realpath(filepath);
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });

            src.forEach(function(filepath) {
                var r = realpath(filepath), d;

                var shasum = crypto.createHash(options.algorithm);
                var s = fs.ReadStream(r);
                s.on('data', function(data) {
                    shasum.update(data, encoding);
                });
                s.on('end', function() {
                    d = shasum.digest('hex');
                    mapping.push([r, r + '?' + d]);

                    if(options.build_dest && d !== originMapping[r]){
                        grunt.file.copy(r, path.join(options.build_dest, filepath));
                        grunt.log.oklns('File: "' + r + '"" copy to build dest.');
                    }

                    if(mapping.length === src.length){
                        output();
                    }
                });
            });

            function realpath(filepath) {
                return cwd ? path.join(cwd, filepath) : filepath;
            }

            function output(){
                var config = '';
                if(grunt.file.exists(dest)){
                    config = grunt.file.read(dest);
                }
                config = config.replace(options.MAP_BLOCK_RE, '').trim();

                config = grunt.template.process(MAP_TPL, {data : {mapArray : JSON.stringify(mapping, 'null', '\t')}}) + '\n' + config;
                grunt.file.write(dest, config);

                grunt.log.oklns('Hash map config write to file: "' + dest + '".');
                done();
            }
        });
    });
};