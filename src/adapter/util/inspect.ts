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

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Arbitary function for value inspection
 *
 * @param args - Arguments
 *
 * @return Return value
 */
export type InspectFunction = (...args: any[]) => any

/**
 * Input type for value inspection
 */
export type InspectValue =
  undefined | null | number | string | object | InspectFunction

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Super-lightweight value inspection
 *
 * util.inspect for the poor. However, it works reasonably well and does not
 * blow up the size of the bundle by 15kb.
 *
 * @param value - Value to inspect
 *
 * @return Stringified value
 */
export function inspect(value: InspectValue): string {
  switch (typeof value) {
    case "object":
      return JSON.stringify(value, undefined, 2).replace(/\s+/g, " ")
    case "string":
      return `'${value}'`
  }
  return ("" + value).replace(/\s+/g, " ")
}
