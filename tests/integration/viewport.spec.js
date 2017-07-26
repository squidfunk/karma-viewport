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

import Viewport from "~/src/adapter/viewport"

/* ----------------------------------------------------------------------------
 * Declarations
 * ------------------------------------------------------------------------- */

/* Viewport */
describe("Viewport", () => {

  /* Integration tests */
  describe("_integration", () => {

    /* Set fixture base path and initialize breakpoints */
    beforeAll(function() {
      fixture.setBase("fixtures")

      /* Initialize breakpoints */
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

    /* Retrieve context */
    beforeEach(function() {
      this.context = parent.document.getElementById("context")
    })

    /* Cleanup fixtures and reset context */
    afterEach(function() {
      fixture.cleanup()

      /* Reset context */
      this.context.style.width = ""
      this.context.style.height = ""
    })

    /* #set */
    describe("#set", () => {

      /* Test: should set width */
      it("should set width",
        setShouldSetWidth
      )

      /* Test: should set width and height */
      it("should set width and height",
        setShouldSetWidthAndHeight
      )

      /* Test: should resolve and set breakpoint */
      it("should resolve and set breakpoint",
        setShouldResolveAndSetBreakpoint
      )
    })

    /* #reset */
    describe("#reset", () => {

      /* Test: should reset width and height */
      it("should reset width and height",
        resetShouldResetWidthAndHeight
      )
    })

    /* #each */
    describe("#each", () => {

      /* Load fixtures */
      beforeEach(() => {
        fixture.load("default.html")
      })

      /* Test: should invoke callback on breakpoints */
      it("should invoke callback on breakpoints",
        eachShouldInvokeCallbackOnBreakpoints
      )
    })
  })
})

/* ----------------------------------------------------------------------------
 * Definitions: #set
 * ------------------------------------------------------------------------- */

/* Test: #set should set width */
function setShouldSetWidth() {
  new Viewport(this.context).set(150)
  expect(this.context.style.width)
    .toEqual("150px")
  expect(this.context.style.height)
    .toBe("")
}

/* Test: #set should set width and height */
function setShouldSetWidthAndHeight() {
  new Viewport(this.context).set(150, 175)
  expect(this.context.style.width)
    .toEqual("150px")
  expect(this.context.style.height)
    .toEqual("175px")
}

/* Test: #set should resolve and set breakpoint */
function setShouldResolveAndSetBreakpoint() {
  new Viewport(this.context, { breakpoints: this.breakpoints }).set("tablet")
  expect(this.context.style.width)
    .toEqual(`${this.breakpoints[1].size.width}px`)
  expect(this.context.style.height)
    .toEqual(`${this.breakpoints[1].size.height}px`)
}

/* ----------------------------------------------------------------------------
 * Definitions: #reset
 * ------------------------------------------------------------------------- */

/* Test: #reset should reset width and height */
function resetShouldResetWidthAndHeight() {
  const viewport = new Viewport(this.context)
  viewport.set(150, 175)
  viewport.reset()
  expect(this.context.style.width)
    .toEqual("")
  expect(this.context.style.height)
    .toEqual("")
}

/* ----------------------------------------------------------------------------
 * Definitions: #each
 * ------------------------------------------------------------------------- */

/* Test: #each should invoke callback on breakpoints */
function eachShouldInvokeCallbackOnBreakpoints() {
  const cb = jasmine.createSpy("callback")
    .and.callFake(name => {
      expect(window.getComputedStyle(document.body).fontSize)
        .toEqual({
          mobile: "16px",
          tablet: "14px",
          screen: "12px"
        }[name])
    })
  new Viewport(this.context, { breakpoints: this.breakpoints }).each(cb)
  expect(cb.calls.count())
    .toEqual(3)
}
