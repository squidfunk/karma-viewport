[![Travis][travis-image]][travis-link]
[![Codecov][codecov-image]][codecov-link]
[![Gitter][gitter-image]][gitter-link]
[![npm][npm-image]][npm-link]

  [travis-image]: https://travis-ci.org/squidfunk/karma-viewport.svg?branch=master
  [travis-link]: https://travis-ci.org/squidfunk/karma-viewport
  [codecov-image]: https://img.shields.io/codecov/c/github/squidfunk/karma-viewport/master.svg
  [codecov-link]: https://codecov.io/gh/squidfunk/karma-viewport
  [gitter-image]: https://img.shields.io/gitter/room/squidfunk/karma-viewport.svg
  [gitter-link]: https://gitter.im/squidfunk/karma-viewport
  [npm-image]: https://img.shields.io/npm/v/karma-viewport.svg
  [npm-link]: https://npmjs.com/packages/karma-viewport

# karma-viewport

Karma viewport resizer for testing responsive features and layout.

## Installation

``` sh
npm install karma-viewport
```

## Usage

### Basic configuration

Add `viewport` to the list of frameworks inside your Karma configuration:

``` js
// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ["viewport"]
  })
}
```

This will expose the global variable `viewport` which allows setting the
dimensions of the viewport within tests, e.g.:

``` js
// Set to 320px x 100%
viewport.set(320)

// Set to 320px x 480px
viewport.set(320, 480)

// Reset to 100% x 100%
viewport.reset()
```

Remember to call `viewport.reset()` after each test, e.g. for [Jasmine][1] or
[Mocha][2]:

``` js
afterEach(() => {
  viewport.reset()
})
```

  [1]: https://jasmine.github.io
  [2]: https://mochajs.org/

### Advanced configuration

#### `config.viewport.context`

By default, `viewport` will target the default `iframe#context` of Karma,
which is enabled through `client.useIframe` (see the [configuration guide][3]).
This will also wrap the `debug` context to run inside the `iframe#context`.

To run tests within a custom, separate context, e.g. `iframe#viewport`:

``` js
// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ["viewport"]

    // Viewport configuration
    viewport: {
      context: "#viewport"
    }
  })
}
```

Note that the `iframe#viewport` element must be present in the `context.html`
and `debug.html` files that are served by Karma. Using a separate, custom
context makes it possible to load entire webpages for testing:

``` js
beforeEach(done => {
  viewport.load("/path/to/fixture.html", done)
})
```

  [3]: http://karma-runner.github.io/1.0/config/configuration-file.html

#### `config.viewport.breakpoints`

For easier, and less repetitive testing, named breakpoints can be easily set:

``` js
// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ["viewport"]

    // Viewport configuration
    viewport: {
      breakpoints: [
        {
          name: "mobile",
          size: {
            width: 320,
            height: 480
          }
        },
        {
          name: "tablet",
          size: {
            width: 768,
            height: 1024
          }
        },
        {
          name: "screen",
          size: {
            width: 1440,
            height: 900
          }
        }
      ]
    }
  })
}
```

The viewport dimensions can then be set using the names of the breakpoints:

``` js
// Set to 320px x 480px
viewport.set("mobile")

// Set to 1440px x 900px
viewport.set("screen")

// Reset to 100% x 100%
viewport.reset()
```

Furthermore, breakpoints can be iterated:

``` js
// Run tests for mobile, tablet and screen
viewport.each(name => {
  // ...
})

// Run tests for tablet and screen
viewport.from("tablet", name => {
  // ...
})

// Run tests for mobile and tablet
viewport.to("tablet", name => {
  // ...
})

// Run tests for tablet and screen
viewport.between("tablet", "screen", name => {
  // ...
})
```

After iteration, `viewport.reset()` is called internally.

## License

**MIT License**

Copyright (c) 2017 Martin Donath

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
