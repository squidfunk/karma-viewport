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

"use strict"

const moniker = require("moniker")

/* ----------------------------------------------------------------------------
 * Configuration
 * ------------------------------------------------------------------------- */

module.exports = karma => {
  const config = {
    basePath: __dirname,

    /* Frameworks to be used */
    frameworks: [
      "jasmine",
      "viewport"
    ],

    /* Include tests */
    files: [
      "smoke/*.js"
    ],

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

    /* Reporters */
    reporters: ["spec"],

    /* Set browsers */
    browsers: ["Chrome"]
  }

  /* Register this plugin with Karma */
  karma.plugins.push(require.resolve(".."))

  /* Travis and SauceLabs integration */
  if (process.env.CI || process.env.SAUCE) {
    if (!process.env.SAUCE_USERNAME ||
        !process.env.SAUCE_ACCESS_KEY)
      throw new Error(
        "SauceConnect: please provide SAUCE_USERNAME " +
        "and SAUCE_ACCESS_KEY")

    /* It should be sufficient to run the smoke test on only one browser */
    const browsers = {
      chrome: {
        base: "SauceLabs",
        browserName: "chrome",
        version: "latest",
        platform: "Windows 7",
        screenResolution: "1280x1024"
      }
    }

    /* SauceLabs job name */
    const id = process.env.TRAVIS
      ? `${process.env.TRAVIS_REPO_SLUG} #${process.env.TRAVIS_BUILD_NUMBER}`
      : `~ #${moniker.choose()}`

    /* Configure SauceLabs integration */
    config.concurrency = 5
    config.sauceLabs = {
      build: process.env.TRAVIS_BUILD_NUMBER,
      testName: id,
      recordVideo: false,
      recordScreenshots: false
    }

    /* Set reporters and browsers */
    config.reporters.push("saucelabs")
    config.browsers = Object.keys(browsers)
    config.customLaunchers = browsers
  }

  /* We're good to go */
  karma.set(config)
}
