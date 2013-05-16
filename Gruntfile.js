/*
 * grunt-sea-hashmap
 * https://github.com/xsbear/grunt-sea-hashmap
 *
 * Copyright (c) 2013 HuangWenping
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>', ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        hashmap: {
            tests: {
                options: {
                    build_dest: 'tmp/.build'
                },
                files: [
                  {
                    cwd: 'test/fixtures/page',
                    src: '*.js',
                    dest: 'tmp/map-config.js'
                  }
                ]
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
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('copyConfig', 'Copy existed config file to tmp/ for testing.', function() {
        grunt.file.copy('test/fixtures/map-config.js', 'tmp/map-config.js');
        grunt.log.write('Copy map-config.js to tmp...');
        grunt.log.ok();
    });

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'copyConfig', 'hashmap', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};