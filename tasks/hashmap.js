/*
 * grunt-sea-hashmap
 * https://github.com/xsbear/grunt-sea-hashmap
 *
 * Copyright (c) 2013 huangwenping
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
            map_tmpl: 'seajs.config({map : <%= mapArray %>});',
            map_pattern: /[^"]+\?\w+/g,
            use_pattern: /data-main="([\/\w\-]+)\?\w*"/,
            use_replace: 'data-main="$1?{{hash}}"'
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
            var originMaping = {};
            var dest = f.dest;

            if (options.build_dest && grunt.file.exists(dest)) {
                var mapContents = fs.readFileSync(dest, encoding);
                var hashArr = mapContents.match(options.map_pattern);
                for (var i = hashArr.length - 1; i >= 0; i--) {
                    var item = hashArr[i].split('?');
                    originMaping[item[0]] = item[1];
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
                md5(r, function(d){
                    mapping.push([r, r + '?' + d]);

                    if(options.build_dest && d !== originMaping[r]){
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

            function md5(path, callback){
                var shasum = crypto.createHash(options.algorithm);
                if(callback === undefined){
                    shasum.update(fs.readFileSync(String(path), encoding));
                    return shasum.digest('hex');
                } else {
                    var s = fs.ReadStream(path);
                    s.on('data', function(data) {
                        shasum.update(data, encoding);
                    });
                    s.on('end', function() {
                        callback(shasum.digest('hex'));
                    });
                }
            }

            function output(){
                var mapContents = grunt.template.process(options.map_tmpl, {data : {mapArray : JSON.stringify(mapping, 'null', '\t')}});
                grunt.file.write(dest, mapContents);
                grunt.log.oklns('Hash map config file: "' + dest + '" saved.');
                done();
                if(options.use_src){
                    updateUseSrc();
                }
            }

            function updateUseSrc(){
                var d = md5(dest);
                var srcContents = fs.readFileSync(options.use_src, encoding);
                srcContents = srcContents.replace(options.use_pattern, options.use_replace.replace('{{hash}}', d));
                fs.writeFileSync(options.use_src, srcContents, encoding);
                grunt.log.oklns('Use source file: "' + options.use_src + '" modified.');
            }
        });
    });
};