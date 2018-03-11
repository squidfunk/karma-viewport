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

import { Viewport } from "~/adapter/viewport"

import { chance } from "_/helpers"
import {
  mockViewportConfiguration,
  mockViewportContext
} from "_/mocks/adapter/viewport"
import { mockQuerySelector } from "_/mocks/document"

/* ----------------------------------------------------------------------------
 * Declarations
 * ------------------------------------------------------------------------- */

/* Viewport */
describe("Viewport", () => {

  /* Viewport configuration and context */
  const config  = mockViewportConfiguration()
  const context = mockViewportContext()

  /* Attach context */
  beforeAll(() => {
    document.body.appendChild(context)
  })

  /* Detach context */
  afterAll(() => {
    document.body.removeChild(context)
  })

  /* #constructor */
  describe("#constructor", () => {

    /* Test: should set configuration */
    it("should set configuration", () => {
      const viewport = new Viewport(config, window)
      expect(viewport.config).toBe(config)
    })

    /* Test: should resolve context */
    it("should resolve context", () => {
      const querySelector = mockQuerySelector(context)
      const viewport = new Viewport(config, window)
      expect(viewport.element).toBe(context)
      expect(querySelector)
        .toHaveBeenCalledWith(config.context)
    })

    /* Test: should throw on missing context */
    it("should throw on missing context", () => {
      // tslint:disable-next-line no-null-keyword
      mockQuerySelector(null)
      expect(() => {
        new Viewport(config, window)
      }).toThrow(
        new TypeError(`No match for selector: '${config.context}'`))
    })
  })

  /* #load */
  describe("#load", () => {

    /* Test: should set context source */
    it("should set context source", done => {
      const viewport = new Viewport(config, window)
      viewport.load("/debug.html", () => {
        expect(context.src).toContain("/debug.html")
        done()
      })
    })
  })

  /* #set */
  describe("#set", () => {

    /* Test: should set width */
    it("should set width", () => {
      const viewport = new Viewport(config, window)
      const width = chance.integer({ min: 100, max: 400 })
      viewport.set(width)
      expect(context.style.width).toEqual(`${width}px`)
      expect(context.style.height).toEqual("")
    })

    /* Test: should set width and height */
    it("should set width and height", () => {
      const viewport = new Viewport(config, window)
      const width  = chance.integer({ min: 100, max: 400 })
      const height = chance.integer({ min: 100, max: 400 })
      viewport.set(width, height)
      expect(context.style.width).toEqual(`${width}px`)
      expect(context.style.height).toEqual(`${height}px`)
    })

    /* Test: should resolve and set breakpoint */
    it("should resolve and set breakpoint", () => {
      const viewport = new Viewport(config, window)
      viewport.set("tablet")
      expect(context.style.width)
        .toEqual(`${config.breakpoints[1].size.width}px`)
      expect(context.style.height)
        .toEqual(`${config.breakpoints[1].size.height}px`)
    })

    /* Test: should force layout */
    it("should force layout", () => {
      spyOn(context, "getBoundingClientRect")
      const viewport = new Viewport(config, window)
      const width = chance.integer({ min: 100, max: 400 })
      viewport.set(width)
      expect(context.getBoundingClientRect)
        .toHaveBeenCalled()
    })

    /* Test: should throw on invalid breakpoint */
    it("should throw on invalid breakpoint", () => {
      const viewport = new Viewport(config, window)
      expect(() => {
        viewport.set("invalid")
      }).toThrow(
        new ReferenceError("Invalid breakpoint: 'invalid'"))
    })

    /* Test: should throw on invalid width */
    it("should throw on invalid width", () => {
      const viewport = new Viewport(config, window)
      const width = chance.integer({ min: -400, max: -100 })
      expect(() => {
        viewport.set(width)
      }).toThrow(
        new TypeError(`Invalid breakpoint width: ${width}`))
    })

    /* Test: should throw on invalid width and height */
    it("should throw on invalid width and height", () => {
      const viewport = new Viewport(config, window)
      const width = chance.integer({ min: -400, max: -100 })
      const height = chance.integer({ min: -400, max: -100 })
      expect(() => {
        viewport.set(width, height)
      }).toThrow(
        new TypeError(`Invalid breakpoint width: ${width}`))
    })

    /* Test: should throw on invalid width */
    it("should throw on invalid height", () => {
      const viewport = new Viewport(config, window)
      const width  = chance.integer({ min: 100, max: 400 })
      const height = chance.integer({ min: -400, max: -100 })
      expect(() => {
        viewport.set(width, height)
      }).toThrow(
        new TypeError(`Invalid breakpoint height: ${height}`))
    })
  })

  /* #reset */
  describe("#reset", () => {

    /* Test: should reset width and height */
    it("should reset width and height", () => {
      const viewport = new Viewport(config, window)
      const width  = chance.integer({ min: 100, max: 400 })
      const height = chance.integer({ min: 100, max: 400 })
      viewport.set(width, height)
      viewport.reset()
      expect(context.style.width).toEqual("")
      expect(context.style.height).toEqual("")
    })

    /* Test: should force layout */
    it("should force layout", () => {
      spyOn(context, "getBoundingClientRect")
      const viewport = new Viewport(config, window)
      viewport.reset()
      expect(context.getBoundingClientRect)
        .toHaveBeenCalled()
    })
  })

  /* #between */
  describe("#between", () => {

    /* Test: should invoke callback on breakpoints */
    it("should invoke callback on breakpoints", () => {
      const cb = jasmine.createSpy("callback")
      const viewport = new Viewport(config, window)
      viewport.between("mobile", "tablet", cb)
      expect(cb).toHaveBeenCalledWith("mobile")
      expect(cb).toHaveBeenCalledWith("tablet")
      expect(cb).not.toHaveBeenCalledWith("screen")
    })
  })

  /* #each */
  describe("#each", () => {

    /* Test: should invoke callback on breakpoints */
    it("should invoke callback on breakpoints", () => {
      const cb = jasmine.createSpy("callback")
      const viewport = new Viewport(config, window)
      viewport.each(cb)
      expect(cb).toHaveBeenCalledWith("mobile")
      expect(cb).toHaveBeenCalledWith("tablet")
      expect(cb).toHaveBeenCalledWith("screen")
    })
  })

  /* #from */
  describe("#from", () => {

    /* Test: should invoke callback on breakpoints */
    it("should invoke callback on breakpoints", () => {
      const cb = jasmine.createSpy("callback")
      const viewport = new Viewport(config, window)
      viewport.from("tablet", cb)
      expect(cb).not.toHaveBeenCalledWith("mobile")
      expect(cb).toHaveBeenCalledWith("tablet")
      expect(cb).toHaveBeenCalledWith("screen")
    })
  })

  /* #to */
  describe("#to", () => {

    /* Test: should invoke callback on breakpoints */
    it("should invoke callback on breakpoints", () => {
      const cb = jasmine.createSpy("callback")
      const viewport = new Viewport(config, window)
      viewport.to("tablet", cb)
      expect(cb).toHaveBeenCalledWith("mobile")
      expect(cb).toHaveBeenCalledWith("tablet")
      expect(cb).not.toHaveBeenCalledWith("screen")
    })
  })
})
