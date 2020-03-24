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

import { ViewportConfiguration } from "~/adapter/viewport"

import { chance } from "_/helpers"

/* ----------------------------------------------------------------------------
 * Values
 * ------------------------------------------------------------------------- */

/**
 * Viewport context selector
 */
const id = chance.string({ pool: "abcdefghijklmnopqrstuvwxyz" })

/* ----------------------------------------------------------------------------
 * Mocks
 * ------------------------------------------------------------------------- */

/**
 * Mock viewport configuration
 *
 * @return Viewport configuration
 */
export function mockViewportConfiguration(): Readonly<ViewportConfiguration> {
  return {
    context: `#${id}`,
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
}

/**
 * Mock viewport context
 *
 * @return Viewport context
 */
export function mockViewportContext(): Readonly<HTMLIFrameElement> {
  const context = document.createElement("iframe")
  context.id = id
  return context
}
