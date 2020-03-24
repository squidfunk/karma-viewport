/*
 * Copyright (c) 2017-2020 Martin Donath <martin.donath@squidfunk.com>
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

import { range, Viewport } from "~/adapter/viewport"

import { chance } from "_/helpers"
import {
  mockViewportConfiguration,
  mockViewportContext
} from "_/mocks/adapter/viewport"
import { mockQuerySelector } from "_/mocks/vendor/document"

/* ----------------------------------------------------------------------------
 * Tests
 * ------------------------------------------------------------------------- */

/* Viewport */
describe("Viewport", () => {

  /* Viewport configuration and context */
  const config  = mockViewportConfiguration()

  /* Viewport context */
  let context: HTMLIFrameElement

  /* Setup fixtures */
  beforeAll(() => {
    fixture.setBase("fixtures")
  })

  /* Create and attach context */
  beforeEach(() => {
    context = mockViewportContext()
    document.body.appendChild(context)

    /* Hack: Internet Explorer doesn't initialize the document for an empty
       iframe, so we have to do it by ourselves, see https://bit.ly/2GaF6Iw */
    context.contentDocument!.write("<body></body>")
  })

  /* Detach context */
  afterEach(() => {
    document.body.removeChild(context)
  })

  /* range */
  describe("range", () => {

    /* Test: should return first breakpoint */
    it("should return first breakpoint", () => {
      const breakpoints = range(config.breakpoints, "mobile")
      expect(breakpoints).toEqual(jasmine.any(Array))
      expect(breakpoints.length).toEqual(1)
      expect(breakpoints[0]).toEqual(config.breakpoints[0])
    })

    /* Test: should return middle breakpoint */
    it("should return middle breakpoint", () => {
      const breakpoints = range(config.breakpoints, "tablet")
      expect(breakpoints).toEqual(jasmine.any(Array))
      expect(breakpoints.length).toEqual(1)
      expect(breakpoints[0]).toEqual(config.breakpoints[1])
    })

    /* Test: should return last breakpoint */
    it("should return last breakpoint", () => {
      const breakpoints = range(config.breakpoints, "screen")
      expect(breakpoints).toEqual(jasmine.any(Array))
      expect(breakpoints.length).toEqual(1)
      expect(breakpoints[0]).toEqual(config.breakpoints[2])
    })

    /* Test: should return first to first breakpoint */
    it("should return first to first breakpoint", () => {
      const breakpoints = range(config.breakpoints, "mobile", "mobile")
      expect(breakpoints).toEqual(jasmine.any(Array))
      expect(breakpoints.length).toEqual(1)
      expect(breakpoints[0]).toEqual(config.breakpoints[0])
    })

    /* Test: should return first to last breakpoint */
    it("should return first to last breakpoint", () => {
      const breakpoints = range(config.breakpoints, "mobile", "screen")
      expect(breakpoints).toEqual(jasmine.any(Array))
      expect(breakpoints.length).toEqual(3)
      expect(breakpoints).toEqual(config.breakpoints)
    })

    /* Test: should return last to last breakpoint */
    it("should return last to last breakpoint", () => {
      const breakpoints = range(config.breakpoints, "screen", "screen")
      expect(breakpoints).toEqual(jasmine.any(Array))
      expect(breakpoints.length).toEqual(1)
      expect(breakpoints[0]).toEqual(config.breakpoints[2])
    })

    /* Test: should throw on invalid breakpoint */
    it("should throw on invalid breakpoint", () => {
      expect(() => {
        range([], "invalid")
      }).toThrow(
        new ReferenceError("Invalid breakpoint: 'invalid'"))
    })
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
      expect(viewport.context).toBe(context)
      expect(querySelector)
        .toHaveBeenCalledWith(config.context)
    })

    /* Test: should throw on missing context */
    it("should throw on missing context", () => {
      // tslint:disable-next-line no-null-keyword
      mockQuerySelector(null)
      expect(() => {
        new Viewport(config, window)
      }).toThrow(new TypeError(`No match for selector: '${config.context}'`))
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

    /* Test: should set context source and return promise */
    it("should set context source and return promise", done => {
      const viewport = new Viewport(config, window)
      viewport.load("/debug.html")
        .then(() => {
          expect(context.src).toContain("/debug.html")
          done()
        })
    })
  })

  /* #offset */
  describe("#offset", () => {

    /* Test: should set horizontal offset */
    it("should set horizontal offset", () => {
      const viewport = new Viewport(config, window)
      const x = chance.integer({ min: 10, max: 100 })
      context.contentDocument!.body.style.width =
        `${context.contentWindow!.innerWidth + x}px`
      context.contentDocument!.body.style.height =
        `${context.contentWindow!.innerHeight}px`
      viewport.offset(x)
      expect(viewport.context.contentWindow!.pageXOffset).toEqual(x)
    })

    /* Test: should set horizontal and vertical offset */
    it("should set horizontal and vertical offset", () => {
      const viewport = new Viewport(config, window)
      const x = chance.integer({ min: 10, max: 100 })
      const y = chance.integer({ min: 10, max: 100 })
      context.contentDocument!.body.style.width =
        `${context.contentWindow!.innerWidth + x}px`
      context.contentDocument!.body.style.height =
        `${context.contentWindow!.innerHeight + y}px`
      viewport.offset(x, y)
      expect(viewport.context.contentWindow!.pageXOffset).toEqual(x)
      expect(viewport.context.contentWindow!.pageYOffset).toEqual(y)
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

    /* Test: should set width and height of breakpoint */
    it("should set width and height of breakpoint", () => {
      const viewport = new Viewport(config, window)
      viewport.set("tablet")
      expect(context.style.width)
        .toEqual(`${config.breakpoints[1].size.width}px`)
      expect(context.style.height)
        .toEqual(`${config.breakpoints[1].size.height}px`)
    })

    /* Test: should force layout */
    it("should force layout", () => {
      spyOn(context.contentDocument!.body, "getBoundingClientRect")
      const viewport = new Viewport(config, window)
      const width = chance.integer({ min: 100, max: 400 })
      viewport.set(width)
      expect(context.contentDocument!.body.getBoundingClientRect)
        .toHaveBeenCalled()
    })

    /* Test: should throw on invalid breakpoint */
    it("should throw on invalid breakpoint", () => {
      const viewport = new Viewport(config, window)
      expect(() => {
        viewport.set("invalid")
      }).toThrow(new ReferenceError("Invalid breakpoint: 'invalid'"))
    })

    /* Test: should throw on invalid width */
    it("should throw on invalid width", () => {
      const viewport = new Viewport(config, window)
      const width = chance.integer({ min: -400, max: -100 })
      expect(() => {
        viewport.set(width)
      }).toThrow(new TypeError(`Invalid breakpoint width: ${width}`))
    })

    /* Test: should throw on invalid width and height */
    it("should throw on invalid width and height", () => {
      const viewport = new Viewport(config, window)
      const width = chance.integer({ min: -400, max: -100 })
      const height = chance.integer({ min: -400, max: -100 })
      expect(() => {
        viewport.set(width, height)
      }).toThrow(new TypeError(`Invalid breakpoint width: ${width}`))
    })

    /* Test: should throw on invalid width */
    it("should throw on invalid height", () => {
      const viewport = new Viewport(config, window)
      const width  = chance.integer({ min: 100, max: 400 })
      const height = chance.integer({ min: -400, max: -100 })
      expect(() => {
        viewport.set(width, height)
      }).toThrow(new TypeError(`Invalid breakpoint height: ${height}`))
    })
  })

  /* #reset */
  describe("#reset", () => {

    /* Test: should reset width and height */
    it("should reset offset", () => {
      const viewport = new Viewport(config, window)
      const x = chance.integer({ min: 10, max: 100 })
      const y = chance.integer({ min: 10, max: 100 })
      context.contentDocument!.body.style.width =
        `${context.contentWindow!.innerWidth + x}`
      context.contentDocument!.body.style.height =
        `${context.contentWindow!.innerHeight + y}`
      viewport.offset(x, y)
      viewport.reset()
      expect(viewport.context.contentWindow!.pageXOffset).toEqual(0)
      expect(viewport.context.contentWindow!.pageYOffset).toEqual(0)
    })

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
      spyOn(context.contentDocument!.body, "getBoundingClientRect")
      const viewport = new Viewport(config, window)
      viewport.reset()
      expect(context.contentDocument!.body.getBoundingClientRect)
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

    /* Test: should invoke callback returning promise on breakpoints */
    it("should invoke callback returning promise on breakpoints", async () => {
      const cb = jasmine.createSpy("callback")
        .and.returnValue(Promise.resolve())
      const viewport = new Viewport(config, window)
      await viewport.between("tablet", "screen", cb)
      expect(cb).not.toHaveBeenCalledWith("mobile")
      expect(cb).toHaveBeenCalledWith("tablet")
      expect(cb).toHaveBeenCalledWith("screen")
    })
  })

  /* #each */
  describe("#each", () => {

    /* Load fixtures */
    beforeEach(() => {
      fixture.load("default.html")
    })

    /* Test: should invoke callback on breakpoints */
    it("should invoke callback on breakpoints", () => {
      const cb = jasmine.createSpy("callback")
      const viewport = new Viewport(config, window)
      viewport.each(cb)
      expect(cb).toHaveBeenCalledWith("mobile")
      expect(cb).toHaveBeenCalledWith("tablet")
      expect(cb).toHaveBeenCalledWith("screen")
    })

    /* Test: should set width and height of breakpoint */
    it("should set width and height of breakpoint", () => {
      const cb = jasmine.createSpy("callback")
        .and.callFake((name: string) => {
          const style = window.getComputedStyle(document.body)
          switch (name) {
            case "mobile": expect(style.fontSize).toEqual("16px"); break
            case "tablet": expect(style.fontSize).toEqual("14px"); break
            case "screen": expect(style.fontSize).toEqual("12px"); break
          }
        })
      const viewport = new Viewport({ ...config, context: "#context" }, window)
      viewport.each(cb)
      expect(cb.calls.count()).toEqual(3)
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
