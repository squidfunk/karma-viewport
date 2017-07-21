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
describe("util/", () => {

  /* inspect */
  describe("inspect", () => {

    /* Test: should handle null */
    it("should handle null",
      defaultShouldHandleNull
    )

    /* Test: should handle undefined */
    it("should handle undefined",
      defaultShouldHandleUndefined
    )

    /* Test: should handle number */
    it("should handle number",
      defaultShouldHandleNumber
    )

    /* Test: should handle string */
    it("should handle string",
      defaultShouldHandleString
    )

    /* Test: should handle empty string */
    it("should handle empty string",
      defaultShouldHandleEmptyString
    )

    /* Test: should handle object */
    it("should handle object",
      defaultShouldHandleObject
    )

    /* Test: should handle function */
    it("should handle function",
      defaultShouldHandleFunction
    )
  })
})

/* ----------------------------------------------------------------------------
 * Definitions: .default
 * ------------------------------------------------------------------------- */

/* Test: .default should handle undefined */
function defaultShouldHandleUndefined() {
  expect(inspect(undefined))
    .toEqual("undefined")
}

/* Test: .default should handle null */
function defaultShouldHandleNull() {
  expect(inspect(null))
    .toEqual("null")
}

/* Test: .default should handle number */
function defaultShouldHandleNumber() {
  expect(inspect(1337))
    .toEqual("1337")
}

/* Test: .default should handle string */
function defaultShouldHandleString() {
  expect(inspect("neurofunk"))
    .toEqual("'neurofunk'")
}

/* Test: .default should handle empty string */
function defaultShouldHandleEmptyString() {
  expect(inspect(""))
    .toEqual("''")
}

/* Test: .default should handle object */
function defaultShouldHandleObject() {
  expect(inspect({ data: true }))
    .toEqual("{ \"data\": true }")
}

/* Test: .default should handle function */
function defaultShouldHandleFunction() {
  expect(inspect((a, b) => a + b))
    .toEqual("function (a, b) { return a + b; }")
}
