# Copyright (c) 2017-2018 Martin Donath <martin.donath@squidfunk.com>

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to
# deal in the Software without restriction, including without limitation the
# rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
# sell copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
# IN THE SOFTWARE.

all: clean lint | build test test/integration

# -----------------------------------------------------------------------------
# Prerequisites
# -----------------------------------------------------------------------------

# Install dependencies
node_modules:
	npm install

# -----------------------------------------------------------------------------
# Targets
# -----------------------------------------------------------------------------

# Build theme for distribution with Webpack
dist/adapter/index.js: $(shell find src/adapter) \
.babelrc webpack.config.ts dist/index.js
	$(shell npm bin)/webpack --env.prod

# Create directories
dist/config dist/static:
	mkdir -p $@

# Copy configuration files
dist/config/%.json: src/config/%.json dist/config
	cp $< $@

# Copy configuration files
dist/static/%.html: src/static/%.html dist/static
	cp $< $@

# Build distribution files
dist/index.js: src/index.ts
	$(shell npm bin)/tsc -p tsconfig.json
	rm -rf dist/adapter

# -----------------------------------------------------------------------------
# Rules
# -----------------------------------------------------------------------------

# Build distribution files
build: \
	node_modules \
	dist/adapter/index.js \
	dist/config/default.json \
	dist/config/schema.json \
	dist/static/debug.html \
	dist/index.js

# Clean distribution files
clean:
	rm -rf coverage dist

# Lint source files
lint: node_modules
	$(shell npm bin)/tslint -p tsconfig.json "{src,tests}/**/*.ts"

# Execute integration tests
test/integration: node_modules build
	$(shell npm bin)/karma start tests/karma.integration.conf.ts \
		--single-run

# Execute unit tests
test: node_modules
	$(shell npm bin)/karma start tests/karma.conf.ts \
		--single-run

# Execute unit tests in watch mode
watch: node_modules
	$(shell npm bin)/karma start tests/karma.conf.ts

# -----------------------------------------------------------------------------

# Special targets
.PHONY: .FORCE build clean lint test/integration test watch
.FORCE:
