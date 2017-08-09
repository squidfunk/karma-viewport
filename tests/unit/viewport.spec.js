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

  /* Setup configuration */
  beforeAll(function() {
    this.config = {
      context: "#viewport",
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
    this.el = document.createElement("iframe")
    this.el.id = "viewport"
    document.body.appendChild(this.el)
  })

  /* Cleanup document */
  afterAll(function() {
    document.body.removeChild(this.el)
  })

  /* Register spies */
  beforeEach(function() {
    this.context = window
    spyOn(this.context.document, "querySelector")
      .and.callFake(selector => {
        return selector !== ".no-match"
          ? this.el
          : null
      })
    spyOn(this.el, "getBoundingClientRect")
  })

  /* #constructor */
  describe("#constructor", () => {

    /* Test: should set configuration */
    it("should set configuration",
      constructorShouldSetConfiguration
    )

    /* Test: should resolve context selector */
    it("should resolve context selector",
      constructorShouldResolveContextSelector
    )

    /* Test: should throw on invalid configuration */
    it("should throw on invalid configuration",
      constructorShouldThrowOnInvalidConfiguration
    )

    /* Test: should throw on empty context selector */
    it("should throw on empty context selector",
      constructorShouldThrowOnEmptyContextSelector
    )

    /* Test: should throw on invalid context selector */
    it("should throw on invalid context selector",
      constructorShouldThrowOnInvalidContextSelector
    )

    /* Test: should throw on invalid breakpoints */
    it("should throw on invalid breakpoints",
      constructorShouldThrowOnInvalidBreakpoints
    )

    /* Test: should throw on invalid context */
    it("should throw on invalid context",
      constructorShouldThrowOnInvalidContext
    )
  })

  /* #load */
  describe("#load", () => {

    /* Test: should set context location */
    it("should set context location",
      loadShouldSetContextLocation
    )

    /* Test: should throw on empty URL */
    it("should throw on empty URL",
      loadShouldThrowOnEmptyURL
    )

    /* Test: should throw on invalid URL */
    it("should throw on invalid URL",
      loadShouldThrowOnInvalidURL
    )

    /* Test: should throw on invalid callback */
    it("should throw on invalid callback",
      loadShouldThrowOnInvalidCallback
    )
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

    /* Test: should force layout */
    it("should force layout",
      setShouldForceLayout
    )

    /* Test: should throw on missing argument */
    it("should throw on missing argument",
      setShouldThrowOnMissingArgument
    )

    /* Test: should throw on invalid breakpoint */
    it("should throw on invalid breakpoint",
      setShouldThrowOnInvalidBreakpoint
    )

    /* Test: should throw on invalid width (one argument) */
    it("should throw on invalid width (one argument)",
      setShouldThrowOnInvalidWidthOneArgument
    )

    /* Test: should throw on invalid width */
    it("should throw on invalid width",
      setShouldThrowOnInvalidWidth
    )

    /* Test: should throw on invalid height */
    it("should throw on invalid height",
      setShouldThrowOnInvalidHeight
    )
  })

  /* #reset */
  describe("#reset", () => {

    /* Test: should reset width and height */
    it("should reset width and height",
      resetShouldResetWidthAndHeight
    )

    /* Test: should force layout */
    it("should force layout",
      resetShouldForceLayout
    )
  })

  /* #between */
  describe("#between", () => {

    /* Test: should invoke callback on breakpoints */
    it("should invoke callback on breakpoints",
      betweenShouldInvokeCallbackOnBreakpoints
    )

    /* Test: should throw on invalid callback */
    it("should throw on invalid callback",
      betweenShouldThrowOnInvalidCallback
    )
  })

  /* #each */
  describe("#each", () => {

    /* Test: should invoke callback on breakpoints */
    it("should invoke callback on breakpoints",
      eachShouldInvokeCallbackOnBreakpoints
    )

    /* Test: should throw on invalid callback */
    it("should throw on invalid callback",
      eachShouldThrowOnInvalidCallback
    )
  })

  /* #from */
  describe("#from", () => {

    /* Test: should invoke callback on breakpoints */
    it("should invoke callback on breakpoints",
      fromShouldInvokeCallbackOnBreakpoints
    )

    /* Test: should throw on invalid callback */
    it("should throw on invalid callback",
      fromShouldThrowOnInvalidCallback
    )
  })

  /* #to */
  describe("#to", () => {

    /* Test: should invoke callback on breakpoints */
    it("should invoke callback on breakpoints",
      toShouldInvokeCallbackOnBreakpoints
    )

    /* Test: should throw on invalid callback */
    it("should throw on invalid callback",
      toShouldThrowOnInvalidCallback
    )
  })
})

/* ----------------------------------------------------------------------------
 * Definitions: #constructor
 * ------------------------------------------------------------------------- */

/* Test: #constructor should set configuration */
function constructorShouldSetConfiguration() {
  expect(new Viewport(this.config, this.context).config)
    .toBe(this.config)
}

/* Test: #constructor should resolve context selector */
function constructorShouldResolveContextSelector() {
  expect(new Viewport(this.config, this.context).element)
    .toBe(this.el)
  expect(this.context.document.querySelector)
    .toHaveBeenCalledWith(this.config.context)
}

/* Test: #constructor should throw on invalid configuration */
function constructorShouldThrowOnInvalidConfiguration() {
  expect(() => {
    new Viewport("")
  }).toThrow(
    new TypeError("Invalid config: ''"))
}

/* Test: #constructor should throw on empty context selector */
function constructorShouldThrowOnEmptyContextSelector() {
  expect(() => {
    new Viewport({ context: "" })
  }).toThrow(
    new TypeError("Invalid config.context: ''"))
}

/* Test: #constructor should throw on invalid context selector */
function constructorShouldThrowOnInvalidContextSelector() {
  expect(() => {
    new Viewport({ context: ".no-match", breakpoints: [] }, this.context)
  }).toThrow(
    new TypeError("No match for context selector: '.no-match'"))
}

/* Test: #constructor should throw on invalid breakpoints */
function constructorShouldThrowOnInvalidBreakpoints() {
  expect(() => {
    new Viewport({ context: "irrelevant", breakpoints: "" })
  }).toThrow(
    new TypeError("Invalid config.breakpoints: ''"))
}

/* Test: #constructor should throw on invalid context */
function constructorShouldThrowOnInvalidContext() {
  expect(() => {
    new Viewport(this.config)
  }).toThrow(
    new TypeError("Invalid context: undefined"))
}

/* ----------------------------------------------------------------------------
 * Definitions: #load
 * ------------------------------------------------------------------------- */

/* Test: #load should set context location */
function loadShouldSetContextLocation() {
  new Viewport(this.config, this.context)
    .load("/debug.html", () => {})
  expect(this.el.src)
    .toContain("/debug.html")
}

/* Test: #load should throw on empty URL */
function loadShouldThrowOnEmptyURL() {
  expect(() => {
    new Viewport(this.config, this.context)
      .load("", () => {})
  }).toThrow(
    new TypeError("Invalid URL: ''"))
}

/* Test: #load should throw on invalid URL */
function loadShouldThrowOnInvalidURL() {
  expect(() => {
    new Viewport(this.config, this.context)
      .load(null, () => {})
  }).toThrow(
    new TypeError("Invalid URL: null"))
}

/* Test: #load should throw on invalid callback */
function loadShouldThrowOnInvalidCallback() {
  expect(() => {
    new Viewport(this.config, this.context)
      .load("irrelevant", null)
  }).toThrow(
    new TypeError("Invalid callback"))
}

/* ----------------------------------------------------------------------------
 * Definitions: #set
 * ------------------------------------------------------------------------- */

/* Test: #set should set width */
function setShouldSetWidth() {
  const width = Math.floor(Math.random() * 200) + 100
  new Viewport(this.config, this.context).set(width)
  expect(this.el.style.width)
    .toEqual(`${width}px`)
  expect(this.el.style.height)
    .toEqual("")
}

/* Test: #set should set width and height */
function setShouldSetWidthAndHeight() {
  const width = Math.floor(Math.random() * 200) + 100
  const height = Math.floor(Math.random() * 200) + 100
  new Viewport(this.config, this.context).set(width, height)
  expect(this.el.style.width)
    .toEqual(`${width}px`)
  expect(this.el.style.height)
    .toEqual(`${height}px`)
}

/* Test: #set should resolve and set breakpoint */
function setShouldResolveAndSetBreakpoint() {
  new Viewport(this.config, this.context).set("tablet")
  expect(this.el.style.width)
    .toEqual(`${this.config.breakpoints[1].size.width}px`)
  expect(this.el.style.height)
    .toEqual(`${this.config.breakpoints[1].size.height}px`)
}

/* Test: #set should force layout */
function setShouldForceLayout() {
  new Viewport(this.config, this.context).set(150)
  expect(this.el.getBoundingClientRect)
    .toHaveBeenCalled()
}

/* Test: #set should throw on missing argument */
function setShouldThrowOnMissingArgument() {
  expect(() => {
    new Viewport(this.config, this.context).set()
  }).toThrow(
    new Error("Invalid arguments: expected 1 or 2 parameters"))
}

/* Test: #set should throw on invalid breakpoint */
function setShouldThrowOnInvalidBreakpoint() {
  expect(() => {
    new Viewport(this.config, this.context).set("invalid")
  }).toThrow(
    new ReferenceError("Invalid breakpoint: 'invalid'"))
}

/* Test: #set should throw on invalid width (one argument) */
function setShouldThrowOnInvalidWidthOneArgument() {
  expect(() => {
    new Viewport(this.config, this.context).set(-150)
  }).toThrow(
    new TypeError("Invalid breakpoint width: -150"))
}

/* Test: #set should throw on invalid width */
function setShouldThrowOnInvalidWidth() {
  expect(() => {
    new Viewport(this.config, this.context).set(-150, 150)
  }).toThrow(
    new TypeError("Invalid breakpoint width: -150"))
}

/* Test: #set should throw on invalid height */
function setShouldThrowOnInvalidHeight() {
  expect(() => {
    new Viewport(this.config, this.context).set(150, -150)
  }).toThrow(
    new TypeError("Invalid breakpoint height: -150"))
}

/* ----------------------------------------------------------------------------
 * Definitions: #reset
 * ------------------------------------------------------------------------- */

/* Test: #reset should reset width and height */
function resetShouldResetWidthAndHeight() {
  const viewport = new Viewport(this.config, this.context)
  viewport.set(150, 175)
  viewport.reset()
  expect(this.el.style.width)
    .toEqual("")
  expect(this.el.style.height)
    .toEqual("")
}

/* Test: #reset should force layout */
function resetShouldForceLayout() {
  new Viewport(this.config, this.context).reset()
  expect(this.el.getBoundingClientRect)
    .toHaveBeenCalled()
}

/* ----------------------------------------------------------------------------
 * Definitions: #between
 * ------------------------------------------------------------------------- */

/* Test: #between should invoke callback on breakpoints */
function betweenShouldInvokeCallbackOnBreakpoints() {
  const cb = jasmine.createSpy("callback")
  new Viewport(this.config, this.context)
    .between("mobile", "tablet", cb)
  expect(cb)
    .toHaveBeenCalledWith("mobile")
  expect(cb)
    .toHaveBeenCalledWith("tablet")
}

/* Test: #between should throw on invalid callback */
function betweenShouldThrowOnInvalidCallback() {
  expect(() => {
    new Viewport(this.config, this.context)
      .between("irrelevant", "irrelevant", null)
  }).toThrow(
    new TypeError("Invalid callback"))
}

/* ----------------------------------------------------------------------------
 * Definitions: #each
 * ------------------------------------------------------------------------- */

/* Test: #each should invoke callback on breakpoints */
function eachShouldInvokeCallbackOnBreakpoints() {
  const cb = jasmine.createSpy("callback")
  new Viewport(this.config, this.context).each(cb)
  expect(cb)
    .toHaveBeenCalledWith("mobile")
  expect(cb)
    .toHaveBeenCalledWith("tablet")
  expect(cb)
    .toHaveBeenCalledWith("screen")
}

/* Test: #each should throw on invalid callback */
function eachShouldThrowOnInvalidCallback() {
  expect(() => {
    new Viewport(this.config, this.context).each(null)
  }).toThrow(
    new TypeError("Invalid callback"))
}

/* ----------------------------------------------------------------------------
 * Definitions: #from
 * ------------------------------------------------------------------------- */

/* Test: #from should invoke callback on breakpoints */
function fromShouldInvokeCallbackOnBreakpoints() {
  const cb = jasmine.createSpy("callback")
  new Viewport(this.config, this.context)
    .from("tablet", cb)
  expect(cb)
    .toHaveBeenCalledWith("tablet")
  expect(cb)
    .toHaveBeenCalledWith("screen")
}

/* Test: #from should throw on invalid callback */
function fromShouldThrowOnInvalidCallback() {
  expect(() => {
    new Viewport(this.config, this.context)
      .from("irrelevant", null)
  }).toThrow(
    new TypeError("Invalid callback"))
}

/* ----------------------------------------------------------------------------
 * Definitions: #to
 * ------------------------------------------------------------------------- */

/* Test: #to should invoke callback on breakpoints */
function toShouldInvokeCallbackOnBreakpoints() {
  const cb = jasmine.createSpy("callback")
  new Viewport(this.config, this.context)
    .to("tablet", cb)
  expect(cb)
    .toHaveBeenCalledWith("mobile")
  expect(cb)
    .toHaveBeenCalledWith("tablet")
}

/* Test: #to should throw on invalid callback */
function toShouldThrowOnInvalidCallback() {
  expect(() => {
    new Viewport(this.config, this.context)
      .to("irrelevant", null)
  }).toThrow(
    new TypeError("Invalid callback"))
}
