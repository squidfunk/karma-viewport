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

import * as moniker from "moniker"
import * as path from "path"

import {
  Config as KarmaConfig,
  ConfigOptions as KarmaConfigOptions
} from "karma"
import {
  Configuration as WebpackConfig,
  ProvidePlugin,
  RuleSetRule as WebpackRuleSetRule
} from "webpack"

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Webpack configuration
 *
 * @param config - Configuration
 *
 * @return Webpack configuration
 */
export function webpack(
  config: KarmaConfig & KarmaConfigOptions
): Partial<WebpackConfig> {
  return {
    mode: "development",
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: ["babel-loader", "ts-loader"],
          exclude: /\/node_modules\//
        },
        ...(config.singleRun
          ? [
              ({
                test: /\.ts$/,
                use: "istanbul-instrumenter-loader?+esModules",
                include: path.resolve(__dirname, "../../src"),
                enforce: "post"
              }) as WebpackRuleSetRule
            ]
          : [])
      ]
    },
    resolve: {
      modules: [
        path.resolve(__dirname, "../../node_modules")
      ],
      extensions: [".ts", ".js"],
      alias: {
        "~": path.resolve(__dirname, "../../src"),
        "_": path.resolve(__dirname, "..")
      }
    },
    plugins: [

      /* Polyfills */
      new ProvidePlugin({
        Promise: "es6-promise"
      })
    ],
    devtool: "source-map"
  }
}

/**
 * SauceLabs configuration
 *
 * @param config - Configuration
 * @param browsers - Browser configuration
 *
 * @return SauceLabs configuration
 */
export function saucelabs(
  config: KarmaConfig & KarmaConfigOptions, browsers: object
): Partial<KarmaConfigOptions> {
  return {

    /* Define browsers to run tests on, see http://bit.ly/2pl96u1 */
    browsers: Object.keys(browsers),
    customLaunchers: browsers as any,

    /* Configure SauceLabs integration */
    concurrency: 5,
    sauceLabs: {
      build: process.env.TRAVIS_BUILD_NUMBER,
      testName: process.env.TRAVIS
        ? `${process.env.TRAVIS_REPO_SLUG} #${process.env.TRAVIS_BUILD_NUMBER}`
        : `~ #${moniker.choose()}`,
      recordVideo: false,
      recordScreenshots: false
    },

    /* Set reporters */
    reporters: config.singleRun
      ? ["summary", "coverage-istanbul", "saucelabs"]
      : ["spec", "clear-screen"],
    specReporter: {
      suppressErrorSummary: true,
      suppressPassed: !config.singleRun
    },
    coverageIstanbulReporter: {
      reports: ["lcovonly"]
    }
  }
}
