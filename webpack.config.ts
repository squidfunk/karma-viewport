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

import * as path from "path"
import {
  Configuration,
  NoEmitOnErrorsPlugin,
  optimize,
  ProvidePlugin
} from "webpack"

/* Webpack plugins */
const {
  UglifyJsPlugin
} = optimize

/* ----------------------------------------------------------------------------
 * Plugins
 * ------------------------------------------------------------------------- */

import EventHooksPlugin = require("event-hooks-webpack-plugin")

/* ----------------------------------------------------------------------------
 * Configuration
 * ------------------------------------------------------------------------- */

export default (env?: { prod?: boolean }) => {
  const config: Configuration = {

    /* Entrypoint */
    entry: [
      path.resolve(__dirname, "src/adapter/index.ts")
    ],

    /* Loaders */
    module: {
      rules: [

        /* TypeScript */
        {
          test: /\.ts$/,
          use: [
            "babel-loader",
            {
              loader: "ts-loader",
              options: {
                compilerOptions: {
                  declaration: true,
                  declarationDir: "..",
                  target: "es2015"     /* Use ES modules for tree-shaking */
                }
              }
            }
          ],
          exclude: /\/node_modules\//
        }
      ]
    },

    /* Export class constructor as entrypoint */
    output: {
      path: path.resolve(__dirname, "dist/adapter"),
      pathinfo: true,
      filename: "index.js",
      libraryTarget: "window"
    },

    /* Plugins */
    plugins: [

      /* Don't emit assets if there were errors */
      new NoEmitOnErrorsPlugin(),

      /* Polyfills */
      new ProvidePlugin({
        Promise: "es6-promise"
      }),

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
    ],

    /* Module resolver */
    resolve: {
      modules: [
        __dirname,
        path.resolve(__dirname, "node_modules")
      ],
      extensions: [".ts", ".js", ".json"]
    },

    /* Sourcemaps */
    devtool: "source-map"
  }

  /* Build for production environment */
  if (env && env.prod) {

    /* Uglify sources */
    config.plugins!.push(
      new UglifyJsPlugin({
        comments: false,
        compress: {
          warnings: false,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true
        },
        sourceMap: true
      }))
  }

  /* We're good to go */
  return config
}
