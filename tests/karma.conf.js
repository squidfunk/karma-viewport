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

const moniker = require("moniker")
const path = require("path")

/* ----------------------------------------------------------------------------
 * Configuration
 * ------------------------------------------------------------------------- */

module.exports = karma => {
  const webpack = require("../webpack.config.js")()

  /* Common configuration (single run and watch mode) */
  const config = {
    basePath: __dirname,

    /* Frameworks to be used */
    frameworks: [
      "fixture",
      "jasmine",
      "jasmine-diff"
    ],

    /* Include fixtures and tests */
    files: [
      "fixtures/**/*",
      "index.js"
    ],

    /* Preprocess fixtures for tests */
    preprocessors: {

      /* HTML fixtures */
      "fixtures/**/*.html": ["html2js"],

      /* Single entrypoint for tests in order for istanbul code coverage to
         work properly in conjunction with Babel */
      "index.js": ["webpack", "sourcemap"]
    },

    /* Webpack configuration */
    webpack,

    /* Test reporters */
    reporters: ["spec"]
  }

  /* Configuration for single run */
  if (karma.singleRun) {

    /* Load webpack config and add istanbul loader for code coverage */
    webpack.module.rules.push({
      test: /\.js$/,
      loader: "istanbul-instrumenter-loader?+esModules",
      include: path.resolve(__dirname, "../src")
    })

    /* Enable short reports and code coverage */
    config.reporters = [
      process.env.CI || process.env.SAUCE
        ? "summary"
        : "spec",
      "coverage-istanbul"
    ]

    /* Configuration for code coverage */
    config.coverageIstanbulReporter = {
      reports: [
        "text-summary",
        "html"
      ]
    }

    /* Automatically launch local Chrome */
    config.browsers = ["Chrome"]

  /* Configuration for watch mode */
  } else {
    config.reporters.unshift("clear-screen")
  }

  /* Additional configuration for continuous integration */
  if (process.env.CI || process.env.SAUCE) {
    if (!process.env.SAUCE_USERNAME ||
        !process.env.SAUCE_ACCESS_KEY)
      throw new Error(
        "SauceConnect: please provide SAUCE_USERNAME " +
        "and SAUCE_ACCESS_KEY")

    /* Define browsers to run tests on, see
       https://wiki.saucelabs.com/display/DOCS/Platform+Configurator */
    const browsers = {

      /* Chrome (latest) */
      chrome: {
        base: "SauceLabs",
        browserName: "chrome",
        version: "latest",
        platform: "Windows 7",
        screenResolution: "1280x1024"
      },

      /* Chrome 57 - latest - 1 doesn't work here */
      chrome1: {
        base: "SauceLabs",
        browserName: "chrome",
        version: "58",
        platform: "Windows 7",
        screenResolution: "1280x1024"
      },

      /* Firefox (latest) */
      firefox: {
        base: "SauceLabs",
        browserName: "firefox",
        version: "latest",
        platform: "Windows 7",
        screenResolution: "1280x1024"
      },

      /* Firefox (latest - 1) */
      firefox1: {
        base: "SauceLabs",
        browserName: "firefox",
        version: "latest-1",
        platform: "Windows 7",
        screenResolution: "1280x1024"
      },

      /* Opera (latest) */
      opera: {
        base: "SauceLabs",
        browserName: "opera",
        version: "latest",
        platform: "Windows 2008",
        screenResolution: "1280x1024"
      },

      /* Edge 14 */
      edge14: {
        base: "SauceLabs",
        browserName: "MicrosoftEdge",
        version: "14",
        platform: "Windows 10",
        screenResolution: "1280x1024"
      },

      /* Edge 13 */
      edge13: {
        base: "SauceLabs",
        browserName: "MicrosoftEdge",
        version: "13",
        platform: "Windows 10",
        screenResolution: "1280x1024"
      },

      /* Internet Explorer 11 */
      ie11: {
        base: "SauceLabs",
        browserName: "internet explorer",
        version: "11",
        platform: "Windows 10",
        screenResolution: "1280x1024"
      },

      /* Internet Explorer 10 */
      ie10: {
        base: "SauceLabs",
        browserName: "internet explorer",
        version: "10",
        platform: "Windows 8",
        screenResolution: "1280x1024"
      },

      /* Internet Explorer 9 */
      ie9: {
        base: "SauceLabs",
        browserName: "internet explorer",
        version: "9",
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

    /* Configuration for code coverage */
    config.coverageIstanbulReporter.reports = ["lcovonly"]

    /* Set reporters and browsers */
    config.reporters.push("saucelabs")
    config.browsers = Object.keys(browsers)
    config.customLaunchers = browsers
  }

  /* We're good to go */
  karma.set(config)
}
