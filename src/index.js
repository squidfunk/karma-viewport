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

const path = require("path")
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
 * Inject adapter and default configuration
 *
 * @param {Object} config - Karma configuration
 */
const framework = config => {
  config.files.push(
    pattern(path.resolve(__dirname, "config/default.json")),
    pattern(path.resolve(__dirname, "adapter/index.js"))
  )

  /* Register preprocessor for viewport configuration */
  config.preprocessors = config.preprocessors || {}
  config.preprocessors["**/config/default.json"] = ["viewport"]
}

/* Dependency injection */
framework.$inject = ["config"]

/**
 * Inject custom configuration
 *
 * @param {Object} [viewport] - Viewport configuration
 *
 * @return {Function} Preprocessor function
 */
const preprocessor = viewport => {
  if (viewport && typeof viewport !== "object")
    throw new TypeError(`Invalid viewport configuration: ${viewport}`)

  /* Return preprocessor function */
  return (content, file, done) => {
    const schema = require("./config/schema.json")
    const config = viewport || JSON.parse(content)

    /* Validate viewport configuration */
    const result = validate(config, schema)
    if (result.errors.length)
      throw new TypeError(
        `Invalid viewport configuration: ${result.errors[0].stack}`)

    /* Store viewport configuration globally */
    done(`window.__viewport__ = ${JSON.stringify(config)}`)
  }
}

/* Dependency injection */
preprocessor.$inject = ["config.viewport"]

/* ----------------------------------------------------------------------------
 * Export with ES5 compatibility
 * ------------------------------------------------------------------------- */

module.exports = {
  "framework:viewport": ["factory", framework],
  "preprocessor:viewport": ["factory", preprocessor]
}
