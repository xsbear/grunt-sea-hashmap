# grunt-sea-hashmap

> Generate a hash mapping for seajs modules when building, in order to burst cache.

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

#### options.map_tmpl
Type: `String`
Default value: `'seajs.config({map : <%= mapArray %>});'`

Template of Hash map config  file.

#### options.map_pattern
Type: `RegExp`
Default value: `/[^"]+\?\w+/g`

RegExp to extract hash map from original config file. If hash doesn't changed, module file will not copy to build directory, that could reduce build task.

#### options.build_dest
Type: `String`

Destination of moudle files which should to build.

#### options.use_src
Type: `String`

File of the sea module use, modify the hash after script source, in order to burst cache.

#### options.use_pattern
Type: `RegExp`
Default value: `/data-main="([\/\w\-]+)\?\w*"/`

RegExp to find use source.

#### options.use_replace
Type: `String`
Default value: `'data-main="$1?{{hash}}'`

Replace string of use_pattern, `'{{hash}}'` will replace with the generated hash.

### Usage Examples


```js
grunt.initConfig({
  hashmap: {
    tests: {
        options: {
            use_src: 'tmp/use.html',
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
**May 2nd, 2013** `0.1.1`

Minor fix.

**May 2nd, 2013** `0.1.0`

First release.
