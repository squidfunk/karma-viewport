/*
 * Copyright (c) 2017-2018 Martin Donath <martin.donath@squidfunk.com>
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

import { chance } from "_/helpers"

/* ----------------------------------------------------------------------------
 * Declarations
 * ------------------------------------------------------------------------- */

/* Viewport */
describe("Viewport", () => {

  /* Viewport context */
  const context = window.parent.document.getElementById("context")!

  /* #set */
  describe("#set", () => {

    /* Reset viewport after each test */
    afterEach(() => {
      viewport.reset()
    })

    /* Test: should set width */
    it("should set width", () => {
      const width = chance.integer({ min: 100, max: 400 })
      viewport.set(width)
      expect(context.style.width).toEqual(`${width}px`)
      expect(context.style.height).toEqual("")
    })

    /* Test: should set width and height */
    it("should set width and height", () => {
      const width  = chance.integer({ min: 100, max: 400 })
      const height = chance.integer({ min: 100, max: 400 })
      viewport.set(width, height)
      expect(context.style.width).toEqual(`${width}px`)
      expect(context.style.height).toEqual(`${height}px`)
    })

    /* Test: should set width and height of breakpoint */
    it("should set width and height of breakpoint", () => {
      viewport.set("tablet")
      expect(context.style.width)
        .toEqual(`${viewport.config.breakpoints[1].size.width}px`)
      expect(context.style.height)
        .toEqual(`${viewport.config.breakpoints[1].size.height}px`)
    })
  })

  /* #reset */
  describe("#reset", () => {

    /* Test: should reset width and height */
    it("should reset width and height", () => {
      const width  = chance.integer({ min: 100, max: 400 })
      const height = chance.integer({ min: 100, max: 400 })
      viewport.set(width, height)
      viewport.reset()
      expect(context.style.width).toEqual("")
      expect(context.style.height).toEqual("")
    })
  })
})
