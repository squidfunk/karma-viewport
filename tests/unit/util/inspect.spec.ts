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

import { inspect } from "~/util/inspect"

import { chance } from "_/helpers"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Utility functions */
describe("util/", () => {

  /* inspect */
  describe("inspect", () => {

    /* Test: should handle undefined */
    it("should handle undefined", () => {
      expect(inspect(undefined)).toEqual("undefined")
    })

    /* Test: should handle null */
    it("should handle null", () => {
      // tslint:disable-next-line no-null-keyword
      expect(inspect(null)).toEqual("null")
    })

    /* Test: should handle number */
    it("should handle number", () => {
      const value = chance.integer()
      expect(inspect(value)).toEqual(`${value}`)
    })

    /* Test: should handle string */
    it("should handle string", () => {
      const value = chance.string()
      expect(inspect(value)).toEqual(`'${value}'`)
    })

    /* Test: should handle empty string */
    it("should handle empty string", () => {
      expect(inspect("")).toEqual("''")
    })

    /* Test: should handle object */
    it("should handle object", () => {
      expect(inspect({ data: true }))
        .toEqual("{ \"data\": true }")
    })

    /* Test: should handle function */
    it("should handle function", () => {
      expect(inspect((x: any, y: any) => x + y))
        .toEqual("function (x, y) { return x + y; }")
    })
  })
})
