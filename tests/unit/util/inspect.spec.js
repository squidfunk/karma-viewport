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

import inspect from "~/src/viewport/util/inspect"

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
