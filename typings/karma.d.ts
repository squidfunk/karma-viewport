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

import "karma"

import { Configuration as WebpackConfig } from "webpack"

declare module "karma" {
  interface ConfigOptions {
    beforeMiddleware?: string[]
    webpack?: Partial<WebpackConfig>   /* karma-webpack */
    specReporter?: {                   /* karma-spec-reporter */
      suppressErrorSummary?: boolean
      suppressPassed?: boolean
      suppressSkipped?: boolean
    }
    coverageIstanbulReporter?: {       /* karma-coverage */
      reports: string[]
    }
    customLaunchers?: any              /* karma-sauce-launcher */
    sauceLabs?: {
      build?: string,
      testName: string,
      recordVideo: boolean,
      recordScreenshots: boolean
    }
  }
  interface ClientOptions {            /* karma-jasmine */
    jasmine?: {
      random: boolean
    }
  }
  interface Injectable {
    (...args: any[]): void
    $inject?: string[]
  }
}
