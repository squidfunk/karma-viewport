[![Github Action][action-image]][action-link]
[![Codecov][codecov-image]][codecov-link]
![Downloads][npm-downloads]
[![Gitter][gitter-image]][gitter-link]
[![npm][npm-image]][npm-link]

  [action-image]: https://github.com/squidfunk/karma-viewport/workflows/ci/badge.svg?branch=master
  [action-link]: https://github.com/squidfunk/karma-viewport/actions
  [codecov-image]: https://img.shields.io/codecov/c/github/squidfunk/karma-viewport/master.svg
  [codecov-link]: https://codecov.io/gh/squidfunk/karma-viewport
  [gitter-image]: https://badges.gitter.im/squidfunk/karma-viewport.svg
  [gitter-link]: https://gitter.im/squidfunk/karma-viewport
  [npm-image]: https://img.shields.io/npm/v/karma-viewport.svg
  [npm-link]: https://npmjs.com/package/karma-viewport
  [npm-downloads]: https://img.shields.io/npm/dm/karma-viewport

# karma-viewport

Karma viewport resizer for testing responsive features and layout

## Installation

``` sh
npm install karma-viewport
```

## Usage

Add `viewport` to the list of frameworks inside your Karma configuration:

``` js
// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ["viewport"]
  })
}
```

This will expose the global variable `viewport` to your tests, which allows
setting the dimensions of the viewport, e.g.:

``` js
// Set to 320px x 100%
viewport.set(320)

// Set to 320px x 480px
viewport.set(320, 480)

// Reset to 100% x 100%
viewport.reset()
```

_Note that you (probably) cannot use `viewport` in the top-level scope of your
tests, as Karma might not have initialized all plugins until all files were
read, so makes sure to call the respective functions from the setup hooks of
your test framework or from within your tests._

### Browser support

Chrome, Firefox, Safari, Edge 13-15, IE 9-11 and possibly some more.

### Configuration

#### `config.viewport.context`

By default, `viewport` will target the default `iframe#context` of Karma,
which is enabled through `client.useIframe` (see the [configuration guide][1]).
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
and `debug.html` files that are served by Karma. You can override the files, or
add an `iframe` element dynamically before running the tests. Using a separate,
custom context makes it possible to load entire webpages for testing:

``` js
await viewport.load("/path/to/fixture.html")
```

  [1]: http://karma-runner.github.io/1.0/config/configuration-file.html

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

After breakpoint iteration, `viewport.reset()` is called internally. If the
callback provided to the breakpoint returns a `Promise`, the return value of
the function will also be a `Promise`. This enables asynchronous tests:

``` js
viewport.each(async name => {
  // await ...
})
```

### TypeScript

`karma-viewport` is written in TypeScript and comes with its own typings. Don't
include the package using an `import` statement, but instead include its types
via `tsconfig.json` or a reference within `karma.conf.ts` or tests:

``` ts
/// <reference types="karma-viewport" />
```

## License

**MIT License**

Copyright (c) 2017-2020 Martin Donath

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
