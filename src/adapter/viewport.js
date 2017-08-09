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

import inspect from "./util/inspect"
import resolve from "./util/resolve"

/* ----------------------------------------------------------------------------
 * Class
 * ------------------------------------------------------------------------- */

export default class Viewport {

  /**
   * Create viewport resizer
   *
   * @constructor
   *
   * @property {Object} config_ - Configuration
   * @property {HTMLIFrameElement} el_ - Viewport element
   *
   * @param {Object} config - Configuration
   * @param {string} config.context - Context selector
   * @param {Array<Object>} config.breakpoints - Breakpoints
   * @param {Window} context - Initialization context
   */
  constructor(config, context) {
    if (typeof config !== "object")
      throw new TypeError(`Invalid config: ${inspect(config)}`)
    if (typeof config.context !== "string" || !config.context.length)
      throw new TypeError(
        `Invalid config.context: ${inspect(config.context)}`)
    if (!(config.breakpoints instanceof Array))
      throw new TypeError(
        `Invalid config.breakpoints: ${inspect(config.breakpoints)}`)
    if (!context || !(context instanceof Window))
      throw new TypeError(`Invalid context: ${inspect(context)}`)

    /* Retrieve viewport element travelling up */
    let current = context,
        el = context.document.querySelector(config.context)
    while (!el && current !== current.parent) {
      current = current.parent
      el = current.document.querySelector(config.context)
    }
    if (!(el instanceof current.HTMLIFrameElement))
      throw new ReferenceError(
        `No match for context selector: ${inspect(config.context)}`)

    /* Set configuration and viewport element */
    this.config_  = config
    this.el_ = el
  }

  /**
   * Load and embed document into viewport
   *
   * @param {string} url - URL of document to load
   * @param {Function} cb - Callback to execute after document was loaded
   */
  load(url, cb) {
    if (typeof url !== "string" || !url.length)
      throw new TypeError(`Invalid URL: ${inspect(url)}`)
    if (typeof cb !== "function")
      throw new TypeError("Invalid callback")

    /* Only execute callback once */
    this.el_.onload = () => {
      this.el_.onload = null
      cb()
    }
    this.el_.src = url
  }

  /**
   * Set viewport to breakpoint identifier, number or array
   *
   * @param {...(string|number|Array<number>)} args - Arguments
   */
  set(...args) {

    /* Width or breakpoint name */
    if (args.length === 1) {
      if (typeof args[0] === "number") {
        const [width] = args
        if (width <= 0)
          throw new TypeError(`Invalid breakpoint width: ${width}`)

        /* Set width and height */
        this.el_.style.width = `${width}px`
        this.el_.style.height = ""
      } else {
        const [breakpoint] = resolve(this.config_.breakpoints, args[0])
        this.set(breakpoint.size.width, breakpoint.size.height)
      }

    /* Explicit width and height */
    } else if (args.length === 2) {
      const [width, height] = args
      if (typeof width !== "number" || width <= 0)
        throw new TypeError(`Invalid breakpoint width: ${width}`)
      if (typeof height !== "number" || height <= 0)
        throw new TypeError(`Invalid breakpoint height: ${height}`)

      /* Set width and height */
      this.el_.style.width = `${width}px`
      this.el_.style.height = `${height}px`

    /* Too few or too many arguments */
    } else {
      throw new Error("Invalid arguments: expected 1 or 2 parameters")
    }

    /* Force layout, so styles are sure to propagate */
    this.el_.getBoundingClientRect()
  }

  /**
   * Reset viewport
   */
  reset() {
    this.el_.style.width = ""
    this.el_.style.height = ""

    /* Force layout, so styles are sure to propagate */
    this.el_.getBoundingClientRect()
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
  between(first, last, cb) {
    if (typeof cb !== "function")
      throw new TypeError("Invalid callback")

    /* Resolve breakpoints and execute callback after resizing */
    resolve(this.config_.breakpoints, first, last).forEach(breakpoint => {
      this.set(breakpoint.size.width, breakpoint.size.height)
      cb(breakpoint.name)
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
  each(cb) {
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
  from(first, cb) {
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
  to(last, cb) {
    this.between(this.config_.breakpoints[0].name, last, cb)
  }

  /**
   * Retrieve configuration
   *
   * @return {Object} Configuration
   */
  get config() {
    return this.config_
  }

  /**
   * Retrieve viewport element
   *
   * @return {HTMLIFrameElement} Viewport element
   */
  get element() {
    return this.el_
  }
}
