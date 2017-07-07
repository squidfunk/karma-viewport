/*
 * Copyright (c) 2017 Martin Donath <martin.donath@squidfunk.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import { inspect, resolve } from "~/src/viewport/util"

/* ----------------------------------------------------------------------------
 * Declarations
 * ------------------------------------------------------------------------- */

/* util */
describe("util", () => {

  /* .inspect */
  describe(".inspect", () => {

    /* Test: should handle null */
    it("should handle null",
      inspectShouldHandleNull
    )

    /* Test: should handle undefined */
    it("should handle undefined",
      inspectShouldHandleUndefined
    )

    /* Test: should handle number */
    it("should handle number",
      inspectShouldHandleNumber
    )

    /* Test: should handle string */
    it("should handle string",
      inspectShouldHandleString
    )

    /* Test: should handle empty string */
    it("should handle empty string",
      inspectShouldHandleEmptyString
    )

    /* Test: should handle object */
    it("should handle object",
      inspectShouldHandleObject
    )

    /* Test: should handle function */
    it("should handle function",
      inspectShouldHandleFunction
    )
  })

  /* .resolve */
  describe(".resolve", () => {

    /* Initialize breakpoints */
    beforeAll(function() {
      this.breakpoints = [
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
    })

    /* Test: should return first breakpoint */
    it("should return first breakpoint",
      resolveShouldReturnFirstBreakpoint
    )

    /* Test: should return middle breakpoint */
    it("should return middle breakpoint",
      resolveShouldReturnMiddleBreakpoint
    )

    /* Test: should return last breakpoint */
    it("should return last breakpoint",
      resolveShouldReturnLastBreakpoint
    )

    /* Test: should return first to first breakpoint */
    it("should return first to first breakpoint",
      resolveShouldReturnFirstToFirstBreakpoint
    )

    /* Test: should return first to last breakpoint */
    it("should return first to last breakpoint",
      resolveShouldReturnFirstToLastBreakpoint
    )

    /* Test: should return last to last breakpoint */
    it("should return last to last breakpoint",
      resolveShouldReturnLastToLastBreakpoint
    )

    /* Test: should throw on empty name */
    it("should throw on empty name",
      resolveShouldThrowOnEmptyName
    )

    /* Test: should throw on invalid name */
    it("should throw on invalid name",
      resolveShouldThrowOnInvalidName
    )

    /* Test: should throw on invalid breakpoint */
    it("should throw on invalid breakpoint",
      resolveShouldThrowOnInvalidBreakpoint
    )
  })
})

/* ----------------------------------------------------------------------------
 * Definitions: .inspect
 * ------------------------------------------------------------------------- */

/* Test: .inspect should handle undefined */
function inspectShouldHandleUndefined() {
  expect(inspect(undefined))
    .toEqual("undefined")
}

/* Test: .inspect should handle null */
function inspectShouldHandleNull() {
  expect(inspect(null))
    .toEqual("null")
}

/* Test: .inspect should handle number */
function inspectShouldHandleNumber() {
  expect(inspect(1337))
    .toEqual("1337")
}

/* Test: .inspect should handle string */
function inspectShouldHandleString() {
  expect(inspect("neurofunk"))
    .toEqual("'neurofunk'")
}

/* Test: .inspect should handle empty string */
function inspectShouldHandleEmptyString() {
  expect(inspect(""))
    .toEqual("''")
}

/* Test: .inspect should handle object */
function inspectShouldHandleObject() {
  expect(inspect({ data: true }))
    .toEqual("{ \"data\": true }")
}

/* Test: .inspect should handle function */
function inspectShouldHandleFunction() {
  expect(inspect((a, b) => a + b))
    .toEqual("function (a, b) { return a + b; }")
}

/* ----------------------------------------------------------------------------
 * Definitions: .resolve
 * ------------------------------------------------------------------------- */

/* Test: .resolve should return first breakpoint */
function resolveShouldReturnFirstBreakpoint() {
  const breakpoints = resolve(this.breakpoints, "mobile")
  expect(breakpoints)
    .toEqual(jasmine.any(Array))
  expect(breakpoints.length)
    .toEqual(1)
  expect(breakpoints[0])
    .toEqual(this.breakpoints[0])
}

/* Test: .resolve should return middle breakpoint */
function resolveShouldReturnMiddleBreakpoint() {
  const breakpoints = resolve(this.breakpoints, "tablet")
  expect(breakpoints)
    .toEqual(jasmine.any(Array))
  expect(breakpoints.length)
    .toEqual(1)
  expect(breakpoints[0])
    .toEqual(this.breakpoints[1])
}

/* Test: .resolve should return first breakpoint */
function resolveShouldReturnLastBreakpoint() {
  const breakpoints = resolve(this.breakpoints, "screen")
  expect(breakpoints)
    .toEqual(jasmine.any(Array))
  expect(breakpoints.length)
    .toEqual(1)
  expect(breakpoints[0])
    .toEqual(this.breakpoints[2])
}

/* Test: .resolve should return first to first breakpoint */
function resolveShouldReturnFirstToFirstBreakpoint() {
  const breakpoints = resolve(this.breakpoints, "mobile", "mobile")
  expect(breakpoints)
    .toEqual(jasmine.any(Array))
  expect(breakpoints.length)
    .toEqual(1)
  expect(breakpoints[0])
    .toEqual(this.breakpoints[0])
}

/* Test: .resolve should return first to last breakpoint */
function resolveShouldReturnFirstToLastBreakpoint() {
  const breakpoints = resolve(this.breakpoints, "mobile", "screen")
  expect(breakpoints)
    .toEqual(jasmine.any(Array))
  expect(breakpoints.length)
    .toEqual(3)
  expect(breakpoints)
    .toEqual(this.breakpoints)
}

/* Test: .resolve should return last to last breakpoint */
function resolveShouldReturnLastToLastBreakpoint() {
  const breakpoints = resolve(this.breakpoints, "screen", "screen")
  expect(breakpoints)
    .toEqual(jasmine.any(Array))
  expect(breakpoints.length)
    .toEqual(1)
  expect(breakpoints[0])
    .toEqual(this.breakpoints[2])
}

/* Test: .resolve should throw on empty name */
function resolveShouldThrowOnEmptyName() {
  expect(() => {
    resolve([], "")
  }).toThrow(
    new TypeError("Invalid breakpoint: ''"))
}

/* Test: .resolve should throw on invalid name */
function resolveShouldThrowOnInvalidName() {
  expect(() => {
    resolve([], null)
  }).toThrow(
    new TypeError("Invalid breakpoint: null"))
}

/* Test: .resolve should throw on invalid breakpoint */
function resolveShouldThrowOnInvalidBreakpoint() {
  expect(() => {
    resolve([], "invalid")
  }).toThrow(
    new ReferenceError("Invalid breakpoint: 'invalid'"))
}
