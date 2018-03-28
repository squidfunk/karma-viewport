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

/** @internal polyfill Array.findIndex */
import "array-findindex-polyfill"

import { inspect } from "./util/inspect"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Viewport breakpoint
 */
export interface ViewportBreakpoint {
  name: string                         /* Breakpoint name */
  size: {
    width: number                      /* Viewport width */
    height: number                     /* Viewport height */
  }
}

/**
 * Viewport configuration
 */
export interface ViewportConfiguration {
  context: string                      /* Context element selector */
  breakpoints: ViewportBreakpoint[]    /* Breakpoints */
}

/**
 * Viewport callback
 */
export type ViewportCallback<T> = (breakpoint: string) => T

/**
 * Extend window element with missing types
 *
 * @internal
 */
declare global {
  interface Window {
    HTMLIFrameElement: typeof HTMLIFrameElement
  }
}

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Resolve relevant breakpoint range
 *
 * @param breakpoints - Breakpoints
 * @param first - First breakpoint name
 * @param last - Last breakpoint name
 *
 * @return Selected breakpoints
 */
export function range(
  breakpoints: ViewportBreakpoint[], first: string, last: string = first
) {
  const [from, to] = [first, last].map(name => {
    const index = breakpoints.findIndex(
      breakpoint => breakpoint.name === name)
    if (index === -1)
      throw new ReferenceError(`Invalid breakpoint: ${inspect(name)}`)
    return index
  })

  /* Return relevant breakpoints */
  return breakpoints.slice(from, to + 1)
}

/**
 * Type guard for Promise
 *
 * @param value - Value to be checked
 *
 * @return Whether the value is a Promise
 */
function isPromise(value: any): value is Promise<any> {
  return Promise.resolve(value) === value
}

/* ----------------------------------------------------------------------------
 * Class
 * ------------------------------------------------------------------------- */

export class Viewport {

  /**
   * Viewport configuration
   */
  public config: Readonly<ViewportConfiguration>

  /**
   * Viewport context
   */
  public context: HTMLIFrameElement

  /**
   * Create viewport resizer
   *
   * @constructor
   *
   * @param config - Viewport configuration
   * @param parent - Initialization context
   */
  public constructor(config: ViewportConfiguration, parent: Window) {

    /* Retrieve context element travelling up */
    let current = parent
    let context = parent.document.querySelector(config.context)
    while (!context && current !== current.parent) {
      current = current.parent
      context = current.document.querySelector(config.context)
    }
    if (!(context instanceof current.HTMLIFrameElement))
      throw new ReferenceError(
        `No match for selector: ${inspect(config.context)}`)

    /* Set configuration and context element */
    this.config  = config
    this.context = context
  }

  /**
   * Load and embed document into viewport
   *
   * @param url - URL of document to load
   *
   * @return Promise resolving with no result
   */
  public load(url: string, cb?: () => void) {
    return new Promise<void>(resolve => {
      const load = () => {
        this.context.removeEventListener("load", load)
        if (cb) cb()
        resolve()
      }
      this.context.addEventListener("load", load)
      this.context.src = url
    })
  }

  /**
   * Change viewport offset (scroll within iframe)
   *
   * @param x - Horizontal offset
   * @param y - Vertical offset
   */
  public offset(x: number, y: number = 0) {
    this.context.contentWindow.scrollTo(x, y)
  }

  /**
   * Set viewport to width (and height) or breakpoint name
   *
   * @param widthOrBreakpoint - Width in pixels or breakpoint name
   * @param height - Height in pixels
   */
  public set(width: number, height?: number): void
  public set(breakpoint: string): void
  public set(widthOrBreakpoint: number | string, height?: number) {

    /* Set viewport by breakpoint name */
    if (typeof widthOrBreakpoint === "string") {
      const [breakpoint] = range(this.config.breakpoints, widthOrBreakpoint)
      return this.set(breakpoint.size.width, breakpoint.size.height)

    /* Set viewport width (and height) */
    } else {
      const width = widthOrBreakpoint
      if (typeof width !== "number" || width <= 0)
        throw new TypeError(`Invalid breakpoint width: ${width}`)
      if (height && (typeof height !== "number" || height <= 0))
        throw new TypeError(`Invalid breakpoint height: ${height}`)

      /* Set width and height */
      this.context.style.width = `${width}px`
      if (height)
        this.context.style.height = `${height}px`
    }

    /* Force layout, so styles are sure to propagate */
    this.context.contentDocument.body.getBoundingClientRect()
  }

  /**
   * Reset viewport
   */
  public reset() {
    this.context.contentWindow.scrollTo(0, 0)
    this.context.style.width = ""
    this.context.style.height = ""

    /* Force layout, so styles are sure to propagate */
    this.context.contentDocument.body.getBoundingClientRect()
  }

  /**
   * Execute a callback for all breakpoints between the first and last given
   *
   * If the callback return value is a Promise, callback invocations will be
   * chained to guarantee sequential execution.
   *
   * @example
   *   viewport.between("mobile", "tablet", name => {
   *     ...
   *   })
   *
   * @param first - First breakpoint name
   * @param last - Last breakpoint name
   * @param cb - Callback to execute after resizing
   *
   * @return Promise resolving with no result
   */
  public between<T extends Promise<any>>(
    first: string, last: string, cb: ViewportCallback<T>
  ): Promise<void>
  public between<T>(first: string, last: string, cb: ViewportCallback<T>): void
  public between<T>(
    first: string, last: string, cb: ViewportCallback<T>
  ): void | Promise<void> {
    const [initial, ...rest] = range(this.config.breakpoints, first, last)

    /* Apply breakpoint and execute callback */
    const invoke = (breakpoint: ViewportBreakpoint) => {
      this.set(breakpoint.size.width, breakpoint.size.height)
      return cb(breakpoint.name)
    }

    /* Execute the first callback and check if it returns a Promise, as we
       need to make sure that everything is executed sequentially */
    const result = invoke(initial)
    if (isPromise(result))
      return rest

        /* Resolve breakpoints and execute callback after resizing */
        .reduce((promise: Promise<any>, breakpoint) => {
          return promise.then(() => breakpoint).then(invoke)
        }, result)

        /* Reset viewport */
        .then(() => this.reset())

    /* Invoke callback and reset viewport */
    rest.forEach(invoke)
    this.reset()
  }

  /**
   * Execute a callback for all breakpoints
   *
   * @example
   *   viewport.each(name => {
   *     ...
   *   })
   *
   * @param cb - Callback to execute after resizing
   *
   * @return Promise resolving with no result
   */
  public each<T extends Promise<any>>(cb: ViewportCallback<T>): Promise<void>
  public each<T>(cb: ViewportCallback<T>): void
  public each<T>(cb: ViewportCallback<T>): void | Promise<void> {
    return this.between(this.config.breakpoints[0].name,
      this.config.breakpoints[this.config.breakpoints.length - 1].name, cb)
  }

  /**
   * Execute a callback starting at the given breakpoint
   *
   * @example
   *   viewport.from("tablet", name => {
   *     ...
   *   })
   *
   * @param first - First breakpoint name
   * @param cb - Callback to execute after resizing
   *
   * @return Promise resolving with no result
   */
  public from<T extends Promise<any>>(
    first: string, cb: ViewportCallback<T>
  ): Promise<void>
  public from<T>(first: string, cb: ViewportCallback<T>): void
  public from<T>(first: string, cb: ViewportCallback<T>): void | Promise<void> {
    return this.between(first,
      this.config.breakpoints[this.config.breakpoints.length - 1].name, cb)
  }

  /**
   * Execute a callback ending at the given breakpoint
   *
   * @example
   *   viewport.to("tablet", name => {
   *     ...
   *   })
   *
   * @param last - Last breakpoint name
   * @param cb - Callback to execute after resizing
   *
   * @return Promise resolving with no result
   */
  public to<T extends Promise<any>>(
    last: string, cb: ViewportCallback<T>
  ): Promise<void>
  public to<T>(last: string, cb: ViewportCallback<T>): void
  public to<T>(last: string, cb: ViewportCallback<T>): void | Promise<void> {
    return this.between(this.config.breakpoints[0].name, last, cb)
  }
}
