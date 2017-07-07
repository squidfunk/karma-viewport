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

import { inspect, resolve } from "./util"

/* ----------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------- */

/**
 * Default options passed to constructor
 *
 * @type {Object}
 */
const OPTIONS = {
  breakpoints: []
}

/* ----------------------------------------------------------------------------
 * Class
 * ------------------------------------------------------------------------- */

export default class Viewport {

  /**
   * Create viewport resizer
   *
   * @constructor
   *
   * @property {HTMLIFrameElement} context_ - Viewport context
   * @property {Object} options_ - Options
   *
   * @param {HTMLIFrameElement} context - Viewport context
   * @param {Object} [options] - Options
   */
  constructor(context, options = OPTIONS) {
    if (!context) // strangely, checking for instanceof always returns false
      throw new TypeError(`Invalid context: ${context}`)
    if (typeof options !== "object")
      throw new TypeError(`Invalid options: ${inspect(options)}`)
    if (!(options.breakpoints instanceof Array))
      throw new TypeError(
        `Invalid breakpoints: ${inspect(options.breakpoints)}`)

    /* Initialize options and context */
    this.options_ = options
    this.context_ = context
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
        this.context_.style.width = `${width}px`
      } else {
        const [breakpoint] = resolve(this.options_.breakpoints, args[0])
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
      this.context_.style.width = `${width}px`
      this.context_.style.height = `${height}px`

    /* Too few or too many arguments */
    } else {
      throw new Error("Invalid arguments: expected 1 or 2 parameters")
    }

    /* Force layout, so styles are sure to propagate */
    this.context_.getBoundingClientRect()
  }

  /**
   * Reset viewport
   */
  reset() {
    this.context_.style.width = ""
    this.context_.style.height = ""
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
    resolve(this.options_.breakpoints, first, last).forEach(breakpoint => {
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
    this.between(this.options_.breakpoints[0].name, this.options_.breakpoints[
      this.options_.breakpoints.length - 1
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
    this.between(first, this.options_.breakpoints[
      this.options_.breakpoints.length - 1
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
    this.between(this.options_.breakpoints[0].name, last, cb)
  }

  /**
   * Retrieve viewport context
   *
   * @return {HTMLIFrameElement} Viewport context
   */
  get context() {
    return this.context_
  }

  /**
   * Retrieve options
   *
   * @return {Object} Options
   */
  get options() {
    return this.options_
  }
}
