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

import * as fs from "fs"
import * as path from "path"
import * as url from "url"

import {
  ServerRequest,
  ServerResponse
} from "http"
import { validate } from "jsonschema"
import {
  ClientOptions,
  ConfigOptions,
  FilePattern,
  Injectable
} from "karma"

import {
  Viewport,
  ViewportConfiguration
} from "./adapter/viewport"
import * as schema from "./config/schema.json"

export {
  Viewport,
  ViewportBreakpoint,
  ViewportCallback,
  ViewportConfiguration
} from "./adapter/viewport"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Augment Karma configuration type
 *
 * This is the exported configuration type for usage within Karma, because the
 * context selector and breakpoints are optional (merged with defaults).
 */
declare module "karma" {
  interface ConfigOptions {
    viewport?: Partial<ViewportConfiguration>
  }
}

/**
 * Extend window element with custom options and viewport instance
 */
declare global  {
  interface Window {
    __viewport__: ViewportConfiguration
    viewport: Viewport
  }
  const viewport: Viewport
}

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Return specification for file server/watcher
 *
 * @param file - File
 *
 * @return File pattern
 */
const pattern = (file: string): FilePattern => ({
  pattern: file,
  included: true,
  served: true,
  watched: false
})

/**
 * Setup framework configuration
 *
 * @param config - Karma configuration
 */
const framework: Injectable = (config: ConfigOptions) => {
  config.files!.push(
    pattern(path.resolve(__dirname, "config/default.json")),
    pattern(path.resolve(__dirname, "adapter/index.js"))
  )

  /* Register debug context middleware */
  config.beforeMiddleware = config.beforeMiddleware || []
  config.beforeMiddleware.push("viewport")

  /* Register preprocessor for viewport configuration */
  config.preprocessors = config.preprocessors || {}
  config.preprocessors[
    path.resolve(__dirname, "config/default.json")
  ] = ["viewport"]
}

/* Dependency injection */
framework.$inject = ["config"]

/**
 * Initialize and configure middleware that runs before Karma's middleware
 *
 * By default, Karma's own context iframe is used for the viewport logic, but
 * the debug context doesn't include an iframe by default. If the requested
 * file is just the plain `debug.html` without the `embed` parameter (which is
 * introduced by this library) we just serve our monkey patched context iframe
 * including the actual debug context, served by Karma's own file server.
 *
 * The %X_UA_COMPATIBLE% placeholder must be replaced with the respective query
 * parameter, as Karma somehow relies on it.
 *
 * @return Connect-compatible middleware
 */
const middleware: Injectable = () =>
  (req: ServerRequest, res: ServerResponse, next: (err?: Error) => void) => {
    const uri = url.parse(req.url!, true)
    if (uri.pathname !== "/debug.html" ||
        typeof uri.query.embed !== "undefined")
      return next()

    /* Serve the surrounding debug context */
    const debug = path.resolve(__dirname, "static/debug.html")
    fs.readFile(debug, (err, data) => {
      if (err)
        return next(err)

      /* Replace placeholder (copied from Karma's source) and serve */
      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(data.toString()
        .replace("%X_UA_COMPATIBLE%",
          '<meta http-equiv="X-UA-Compatible" content="' +
            uri.query["x-ua-compatible"] +
          '" />'), "utf-8")
    })
  }

/**
 * Inject custom configuration
 *
 * @param viewport - Viewport configuration
 * @param client - Client configuration
 *
 * @return Preprocessor function
 */
const preprocessor: Injectable =
  (viewport: ViewportConfiguration, client: ClientOptions) => {
    if (viewport && typeof viewport !== "object")
      throw new TypeError(`Invalid viewport configuration: ${viewport}`)

    /* Return preprocessor function */
    return (content: string, file: string, done: (result: string) => void) => {
      const config: ViewportConfiguration =
        Object.assign(JSON.parse(content), viewport)

      /* Validate viewport configuration */
      const result = validate(config, schema)
      if (result.errors.length)
        throw new TypeError(
          `Invalid viewport configuration: ${result.errors[0].stack}`)

      /* Karma must run inside an iframe, if the context defaults */
      if (config.context === "#context" && !client.useIframe)
        throw new Error("Invalid configuration: client.useIframe " +
          "must be set to true or a different context selector must be given")

      /* Store viewport configuration globally */
      done(`window.__viewport__ = ${JSON.stringify(config, undefined, 2)}`)
    }
  }

/* Dependency injection */
preprocessor.$inject = ["config.viewport", "config.client"]

/* ----------------------------------------------------------------------------
 * Export with ES5 compatibility
 * ------------------------------------------------------------------------- */

module.exports = {
  "framework:viewport": ["factory", framework],
  "middleware:viewport": ["factory", middleware],
  "preprocessor:viewport": ["factory", preprocessor]
}
