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

// import * as moniker from "moniker"
import * as path from "path"

import {
  Config as KarmaConfig,
  ConfigOptions as KarmaConfigOptions
} from "karma"
import {
  Configuration as WebpackConfig,
  NewModule as WebpackNewModule
} from "webpack"

/* ----------------------------------------------------------------------------
 * Plugins
 * ------------------------------------------------------------------------- */

import EventHooksPlugin = require("event-hooks-webpack-plugin")

/* ----------------------------------------------------------------------------
 * Configuration
 * ------------------------------------------------------------------------- */

export default (config: KarmaConfig & KarmaConfigOptions) => {

  /* Webpack configuration */
  const webpack: Partial<WebpackConfig> = {
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: ["babel-loader", "ts-loader"],
          exclude: /\/node_modules\//
        }
      ]
    },
    resolve: {
      modules: [
        path.resolve(__dirname, "../node_modules")
      ],
      extensions: [".js", ".ts"],
      alias: {
        "~": path.resolve(__dirname, "../src/adapter"),
        "_": __dirname
      }
    },
    plugins: [

      /* Hack: The webpack development middleware sometimes goes into a loop
         on macOS when starting for the first time. This is a quick fix until
         this issue is resolved. See: http://bit.ly/2AsizEn */
      new EventHooksPlugin({
        "watch-run": (compiler: any, done: () => {}) => {
          compiler.startTime += 10000
          done()
        },
        "done": (stats: any) => {
          stats.startTime -= 10000
        }
      })
    ]
  }

  /* Instrumentation for code coverage */
  if (config.singleRun)
    (webpack.module as WebpackNewModule).rules.push({
      test: /\.tsx?$/,
      use: "istanbul-instrumenter-loader?+esModules",
      include: path.resolve(__dirname, "../src"),
      enforce: "post"
    })

  /* Karma configuration */
  config.set({
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
      "index.ts"
    ],

    /* Preprocessors */
    preprocessors: {
      "fixtures/**/*.html": ["html2js"],
      "index.ts": [
        "webpack",
        "sourcemap"
      ]
    },

    /* Webpack configuration */
    webpack,

    /* Reporters */
    reporters: config.singleRun
      ? ["spec", "coverage-istanbul"]
      : ["spec", "clear-screen"],

    /* Browsers */
    browsers: ["Chrome"],

    /* Configuration for spec reporter */
    specReporter: {
      suppressErrorSummary: true,
      suppressSkipped: !config.singleRun
    },

    /* Configuration for coverage reporter */
    coverageIstanbulReporter: {
      reports: [
        "html",
        "text"
      ]
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
    }
  })

  // /* Travis and SauceLabs integration */
  // if (process.env.TRAVIS || process.env.SAUCE) {
  //   if (!process.env.SAUCE_USERNAME ||
  //       !process.env.SAUCE_ACCESS_KEY)
  //     throw new Error(
  //       "SauceConnect: please provide SAUCE_USERNAME " +
  //       "and SAUCE_ACCESS_KEY")
  //
  //   /* Define browsers to run tests on, see
  //      https://wiki.saucelabs.com/display/DOCS/Platform+Configurator */
  //   const browsers = {
  //
  //     /* Chrome (latest) */
  //     chrome: {
  //       base: "SauceLabs",
  //       browserName: "chrome",
  //       version: "latest",
  //       platform: "Windows 7",
  //       screenResolution: "1280x1024"
  //     },
  //
  //     /* Chrome (latest - 1) */
  //     chrome1: {
  //       base: "SauceLabs",
  //       browserName: "chrome",
  //       version: "latest-1",
  //       platform: "Windows 7",
  //       screenResolution: "1280x1024"
  //     },
  //
  //     /* Firefox (latest) */
  //     firefox: {
  //       base: "SauceLabs",
  //       browserName: "firefox",
  //       version: "latest",
  //       platform: "Windows 7",
  //       screenResolution: "1280x1024"
  //     },
  //
  //     /* Firefox (latest - 1) */
  //     firefox1: {
  //       base: "SauceLabs",
  //       browserName: "firefox",
  //       version: "latest-1",
  //       platform: "Windows 7",
  //       screenResolution: "1280x1024"
  //     },
  //
  //     /* Opera (latest) */
  //     opera: {
  //       base: "SauceLabs",
  //       browserName: "opera",
  //       version: "latest",
  //       platform: "Windows 2008",
  //       screenResolution: "1280x1024"
  //     },
  //
  //     /* Edge 15 */
  //     edge15: {
  //       base: "SauceLabs",
  //       browserName: "MicrosoftEdge",
  //       version: "15",
  //       platform: "Windows 10",
  //       screenResolution: "1280x1024"
  //     },
  //
  //     /* Edge 14 */
  //     edge14: {
  //       base: "SauceLabs",
  //       browserName: "MicrosoftEdge",
  //       version: "14",
  //       platform: "Windows 10",
  //       screenResolution: "1280x1024"
  //     },
  //
  //     /* Edge 13 */
  //     edge13: {
  //       base: "SauceLabs",
  //       browserName: "MicrosoftEdge",
  //       version: "13",
  //       platform: "Windows 10",
  //       screenResolution: "1280x1024"
  //     },
  //
  //     /* Internet Explorer 11 */
  //     ie11: {
  //       base: "SauceLabs",
  //       browserName: "internet explorer",
  //       version: "11",
  //       platform: "Windows 10",
  //       screenResolution: "1280x1024"
  //     },
  //
  //     /* Internet Explorer 10 */
  //     ie10: {
  //       base: "SauceLabs",
  //       browserName: "internet explorer",
  //       version: "10",
  //       platform: "Windows 8",
  //       screenResolution: "1280x1024"
  //     },
  //
  //     /* Internet Explorer 9 */
  //     ie9: {
  //       base: "SauceLabs",
  //       browserName: "internet explorer",
  //       version: "9",
  //       platform: "Windows 7",
  //       screenResolution: "1280x1024"
  //     }
  //   }
  //
  //   /* SauceLabs job name */
  //   const id = process.env.TRAVIS
  //     ? `${process.env.TRAVIS_REPO_SLUG} #${process.env.TRAVIS_BUILD_NUMBER}`
  //     : `~ #${moniker.choose()}`
  //
  //   /* Configure SauceLabs integration */
  //   config.concurrency = 5
  //   config.sauceLabs = {
  //     build: process.env.TRAVIS_BUILD_NUMBER,
  //     testName: id,
  //     recordVideo: false,
  //     recordScreenshots: false
  //   }
  //
  //   /* Set browsers */
  //   config.browsers = Object.keys(browsers)
  //   config.customLaunchers = browsers
  //
  //   /* Set reporters */
  //   if (karma.singleRun) {
  //     config.reporters.push("summary")
  //   } else {
  //     config.reporters.push("spec")
  //     config.specReporter.suppressPassed = true
  //   }
  //
  // /* Local environment */
  // } else {
  //
  //   /* Set reporters and browsers */
  //   config.reporters.push("clear-screen", "spec")
  //   config.browsers = ["Chrome"]
  // }
  //
  // /* Determine code coverage in single run */
  // if (karma.singleRun) {
  //
  //   /* Load webpack config and add istanbul loader for code coverage */
  //   webpack.module.rules.push({
  //     test: /\.js$/,
  //     loader: "istanbul-instrumenter-loader?+esModules",
  //     include: path.resolve(__dirname, "../src")
  //   })
  //
  //   /* Enable code coverage */
  //   config.reporters.push("coverage-istanbul")
  //   config.coverageIstanbulReporter = {
  //     reports: [
  //       "html",
  //       "text-summary"
  //     ]
  //   }
  //
  //   /* Continuous integration reporters */
  //   if (process.env.TRAVIS || process.env.SAUCE) {
  //     config.reporters.push("saucelabs")
  //     config.coverageIstanbulReporter.reports = ["lcovonly"]
  //   }
  // }
  //
  // /* We're good to go */
  // karma.set(config)
}
