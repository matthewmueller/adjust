development:
	@PORT=5000 ./node_modules/.bin/roo examples/index.js examples/index.css

test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter spec

lint:
	@./node_modules/.bin/snazzy

.PHONY: test lint
