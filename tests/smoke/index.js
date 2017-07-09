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

/* ----------------------------------------------------------------------------
 * Declarations
 * ------------------------------------------------------------------------- */

/* Viewport */
describe("Viewport", () => {

  /* Smoke tests */
  describe("_smoke", () => {

    /* Retrieve context */
    beforeEach(function() {
      this.context = parent.document.getElementById("context")
    })

    /* Reset viewport */
    afterEach(() => {
      viewport.reset()
    })

    /* Test: should be defined */
    it("should be defined",
      shouldBeDefined
    )

    /* Test: should set viewport */
    it("should set viewport",
      shouldSetViewport
    )

    /* Test: should set viewport by breakpoint */
    it("should set viewport by breakpoint",
      shouldSetViewportByBreakpoint
    )

    /* Test: should reset viewport */
    it("should reset viewport",
      shouldResetViewport
    )
  })
})

/* ----------------------------------------------------------------------------
 * Definitions
 * ------------------------------------------------------------------------- */

/* Test: should be defined */
function shouldBeDefined() {
  expect(viewport)
    .toEqual(jasmine.any(Object))
}

/* Test: should set viewport */
function shouldSetViewport() {
  viewport.set(320, 480)
  expect(this.context.style.width)
    .toEqual("320px")
  expect(this.context.style.height)
    .toEqual("480px")
}

/* Test: should set viewport */
function shouldSetViewportByBreakpoint() {
  viewport.set("tablet")
  expect(this.context.style.width)
    .toEqual("768px")
  expect(this.context.style.height)
    .toEqual("1024px")
}

/* Test: should reset viewport */
function shouldResetViewport() {
  viewport.set(320, 480)
  viewport.reset()
  expect(this.context.style.width)
    .toEqual("")
  expect(this.context.style.height)
    .toEqual("")
}
