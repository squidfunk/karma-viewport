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

const fs = require("fs")
const path = require("path")
const url = require("url")
const validate = require("jsonschema").validate

/* ----------------------------------------------------------------------------
 * Functions
 * ------------------------------------------------------------------------- */

/**
 * Return specification for file server/watcher
 *
 * @param {string} file - File
 *
 * @return {Object} Specification
 */
const pattern = file => {
  return {
    pattern: file,
    included: true,
    served: true,
    watched: false
  }
}

/**
 * Setup framework configuration
 *
 * @param {Object} config - Karma configuration
 */
const framework = config => {
  config.files.push(
    pattern(path.resolve(__dirname, "config/default.json")),
    pattern(path.resolve(__dirname, "adapter/index.js"))
  )

  /* Register middleware before Karma's own middleware */
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
 * karma-viewport relies on the context iframe being present. This is not true
 * for the debug context, so we need to patch it. If the requested file is just
 * the plain `debug.html` without the embed parameter (which is introduced by
 * this library) we just serve our monkey patched context iframe including the
 * actual debug context, which is served by Karma's own file server.
 *
 * The %X_UA_COMPATIBLE% placeholder must be replaced with the respective query
 * parameter, as Karma somehow relies on it.
 *
 * @return {Function} Connect-compatible middleware
 */
const middleware = () => {
  return (req, res, next) => {
    const uri = url.parse(req.url, true)
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
}

/* Dependency injection */
middleware.$inject = []

/**
 * Inject custom configuration
 *
 * @param {Object} viewport - Viewport configuration
 * @param {Object} client - Client configuration
 *
 * @return {Function} Preprocessor function
 */
const preprocessor = (viewport, client) => {
  if (viewport && typeof viewport !== "object")
    throw new TypeError(`Invalid viewport configuration: ${viewport}`)

  /* Return preprocessor function */
  return (content, file, done) => {
    const schema = require("./config/schema")
    const config = Object.assign(JSON.parse(content), viewport)

    /* Validate viewport configuration */
    const result = validate(config, schema)
    if (result.errors.length)
      throw new TypeError(
        `Invalid viewport configuration: ${result.errors[0].stack}`)

    /* Karma must run inside an iframe, if the context defaults */
    if (config.selector === "#context" && !client.useIframe)
      throw new Error("Invalid configuration: " +
        "client.useIframe must be set to true for karma-viewport to function")

    /* Store viewport configuration globally */
    done(`window.__viewport__ = ${JSON.stringify(config)}`)
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
