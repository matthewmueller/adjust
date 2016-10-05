development:
	budo examples/index.js --live --pushstate --open --css /examples/index.css

test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter spec

lint:
	@./node_modules/.bin/snazzy

.PHONY: test lint
