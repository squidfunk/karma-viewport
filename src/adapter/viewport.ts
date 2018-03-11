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

import { Schema as Configuration } from "../config/schema"
import { inspect } from "./util/inspect"

import resolve from "./util/resolve"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

interface WindowExt extends Window {
  HTMLIFrameElement?: typeof HTMLIFrameElement
}

/* ----------------------------------------------------------------------------
 * Class
 * ------------------------------------------------------------------------- */

export class Viewport {

  /**
   * Viewport configuration
   */
  protected config_: Configuration

  /**
   * Viewport context
   */
  protected context_: HTMLIFrameElement

  /**
   * Create viewport resizer
   *
   * @constructor
   *
   * @property {Object} config_ - Configuration
   * @property {HTMLIFrameElement} context_ - Viewport element
   *
   * @param config - Configuration
   * @param parent - Initialization context
   */
  public constructor(config: Configuration, parent: WindowExt) { // TODO: this must be renamed!!!!!!!!

    /* Retrieve context element travelling up */
    let current = parent
    let el = parent.document.querySelector(config.context)
    while (!el && current !== current.parent) {
      current = current.parent as WindowExt
      el = current.document.querySelector(config.context)
    }
    if (!(el instanceof current.HTMLIFrameElement!))
      throw new ReferenceError(
        `No match for selector: ${inspect(config.context)}`)

    /* Set configuration and context element */
    this.config_ = config
    this.context_ = el // TODO: context! el = viewport element which is resized
  }

  /**
   * Load and embed document into viewport
   *
   * @param url - URL of document to load
   * @param done - Callback to execute after document was loaded
   */
  public load(url: string, done: (err?: Error) => void) {
    const load = () => {
      this.context_.removeEventListener("load", load)
      done()
    }
    this.context_.addEventListener("load", load)
    this.context_.src = url
  }

  /**
   * Set viewport to breakpoint identifier, number or array
   *
   * @param {...(string|number|Array<number>)} args - Arguments
   */
  public set(width: number, height?: number): void
  public set(breakpoint: string): void
  public set(...args: any[]) {

    /* Width or breakpoint name */
    if (args.length === 1) {
      if (typeof args[0] === "number") {
        const [width] = args
        if (width <= 0)
          throw new TypeError(`Invalid breakpoint width: ${width}`)

        /* Set width and height */
        this.context_.style.width = `${width}px`
        this.context_.style.height = ""
      } else {
        const [breakpoint] = resolve(this.config_.breakpoints, args[0])
        this.set(breakpoint.size.width, breakpoint.size.height)
      }

    /* Explicit width and height */
    } else {
      const [width, height] = args
      if (typeof width !== "number" || width <= 0)
        throw new TypeError(`Invalid breakpoint width: ${width}`)
      if (typeof height !== "number" || height <= 0)
        throw new TypeError(`Invalid breakpoint height: ${height}`)

      /* Set width and height */
      this.context_.style.width = `${width}px`
      this.context_.style.height = `${height}px`
    }

    /* Force layout, so styles are sure to propagate */ // TODO: request animation frame with promise!
    // await viewport.set(250)
    this.context_.getBoundingClientRect()
  }

  // TODO: add typings! "Breakpoint" should be a type and referenced in karma
  // and exposed through typings!

  /**
   * Reset viewport
   */
  public reset() {
    this.context_.style.width = ""
    this.context_.style.height = ""

    /* Force layout, so styles are sure to propagate */
    this.context_.getBoundingClientRect()
  }

  /**
   * Execute a callback for all breakpoints between the first and last given
   *
   * @example
   *   viewport.between("mobile", "tablet", name => {
   *     ...
   *   })
   *
   * @param {string} first - First breakpoint name
   * @param {string} last - Last breakpoint name
   * @param {Function} cb - Callback to execute after resizing
   */
  public between(first: string, last: string, cb: (name: string) => {}) {

    /* Resolve breakpoints and execute callback after resizing */
    resolve(this.config_.breakpoints, first, last).forEach((breakpoint: any) => {
      this.set(breakpoint.size.width, breakpoint.size.height)
      cb(breakpoint.name)
      // TODO: async callback!? async await? promise?
    })

    /* Reset viewport */
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
   * @param {Function} cb - Callback to execute after resizing
   */
  public each(cb: () => {}) {
    this.between(this.config_.breakpoints[0].name, this.config_.breakpoints[
      this.config_.breakpoints.length - 1
    ].name, cb)
  }

  /**
   * Execute a callback starting at the given breakpoint
   *
   * @example
   *   viewport.from("tablet", name => {
   *     ...
   *   })
   *
   * @param {string} first - First breakpoint name
   * @param {Function} cb - Callback to execute after resizing
   */
  public from(first: string, cb: () => {}) {
    this.between(first, this.config_.breakpoints[
      this.config_.breakpoints.length - 1
    ].name, cb)
  }

  /**
   * Execute a callback ending at the given breakpoint
   *
   * @example
   *   viewport.to("tablet", name => {
   *     ...
   *   })
   *
   * @param {string} last - Last breakpoint name
   * @param {Function} cb - Callback to execute after resizing
   */
  public to(last: string, cb: () => {}) {
    this.between(this.config_.breakpoints[0].name, last, cb)
  }

  /**
   * Retrieve configuration
   *
   * @return {Object} Configuration
   */
  public get config() {
    return this.config_
  }

  /**
   * Retrieve context element
   *
   * @return {HTMLIFrameElement} context element    // TODO: rename this into viewport.context
   */
  public get element() {
    return this.context_
  }
}
