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

/// <reference path="../src/index.ts" />

import {
  Config as KarmaConfig,
  ConfigOptions as KarmaConfigOptions
} from "karma"

import * as browsers from "./karma/browsers/integration.json"
import { saucelabs, webpack } from "./karma/common"

/* ----------------------------------------------------------------------------
 * Configuration
 * ------------------------------------------------------------------------- */

export default (config: KarmaConfig & KarmaConfigOptions) => {
  config.set({
    basePath: __dirname,

    /* Frameworks to be used */
    frameworks: [
      "jasmine",
      "viewport"
    ],

    /* Include tests */
    files: [
      "suites/integration/**/*.ts"
    ],

    /* Preprocessors */
    preprocessors: {
      "**/*.ts": [
        "webpack",
        "sourcemap"
      ]
    },

    /* Register this plugin with Karma */
    plugins: [
      ...config.plugins!,
      require.resolve("..")
    ],

    /* Webpack configuration */
    webpack: webpack(config),

    /* Reporters */
    reporters: config.singleRun
      ? ["spec"]
      : ["spec", "clear-screen"],

    /* Browsers */
    browsers: ["Chrome"],

    /* Configuration for spec reporter */
    specReporter: {
      suppressErrorSummary: true,
      suppressSkipped: !config.singleRun
    },

    /* Hack: Don't serve TypeScript files with "video/mp2t" mime type */
    mime: {
      "text/x-typescript": ["ts"]
    },

    /* Client configuration */
    client: {
      jasmine: {
        random: false
      }
    },

    /* Viewport configuration */
    viewport: {
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
    },

    /* Configuration overrides */
    ...(process.env.TRAVIS || process.env.SAUCE
      ? saucelabs(config, browsers)
      : {}),

    /* Configuration for coverage reporter */
    coverageIstanbulReporter: {
      reports: []
    }
  })
}
