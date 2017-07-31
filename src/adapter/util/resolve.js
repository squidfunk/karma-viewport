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

import "array-findindex-polyfill"

import inspect from "./inspect"

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Resolve relevant breakpoints
 *
 * @param {Array<Object>} breakpoints - Breakpoints
 * @param {string} first - First breakpoint name
 * @param {string} [last] - Last breakpoint name
 *
 * @return {Array<Object>} Selected breakpoints
 */
export default (breakpoints, first, last = first) => {
  const [from, to] = [first, last].map(name => {
    if (typeof name !== "string" || !name.length)
      throw new TypeError(`Invalid breakpoint: ${inspect(name)}`)

    /* Find the offset of the specified breakpoint */
    const index = breakpoints.findIndex(
      breakpoint => breakpoint.name === name)
    if (index === -1)
      throw new ReferenceError(`Invalid breakpoint: ${inspect(name)}`)
    return index
  })

  /* Return relevant breakpoints */
  return breakpoints.slice(from, to + 1)
}
