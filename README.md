# grunt-sea-hashmap

> Generate a hash mapping for seajs modules when building, in order to burst cache.

[![Build Status](https://travis-ci.org/xsbear/grunt-sea-hashmap.png?branch=master)](https://travis-ci.org/xsbear/grunt-sea-hashmap)

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-sea-hashmap --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-sea-hashmap');
```

## The "hashmap" task

### Overview
In your project's Gruntfile, add a section named `hashmap` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  hashmap: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.algorithm
Type: `String`
Default value: `'md5'`

Specific algorithm to generate hash.


#### options.encoding
Type: `String`
Default value: `'utf8'`

Specific file encoding.

#### options.map_tpl
Type: `String`
Default value: `path.join(__dirname, 'map.tpl')`

Path of hash map template file.

#### options.MAP_FILE_RE
Type: `RegExp`
Default value: `/[^"]+\?\w+/g`

RegExp to extract hash map from original config file. If hash doesn't changed, module file will not copy to build directory, that could reduce build task.

#### options.MAP_BLOCK_RE
Type: `RegExp`
Default value: `/\/\*map start\*\/[\s\S]*\/\*map end\*\//`

RegExp to cut map config block, in order to insert a new map config block into the dest config file. It related with the content of  `map_tpl`.

#### options.build_dest
Type: `String`

Destination of moudle files which should to build.


### Usage Examples


```js
grunt.initConfig({
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
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
**May 16nd, 2013** `0.2.0`

Remove use_src option, just focus on generating hash map config.

**May 2nd, 2013** `0.1.1`

Minor fix.

**May 2nd, 2013** `0.1.0`

First release.
