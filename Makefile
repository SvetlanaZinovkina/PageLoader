install:
	npm ci

lint:
	npx eslint

publish:
	npm publish --dry-run

test:
	NODE_OPTIONS=--experimental-vm-modules npx jest

test-coverage:
	NODE_OPTIONS=--experimental-vm-modules npx jest --coverage

#coverage:
#	NODE_OPTIONS=--experimental-vm-modules npx jest --coverage

watch:
	NODE_OPTIONS=--experimental-vm-modules npx jest --watch

nockdebug:
	DEBUG=nock.* NODE_OPTIONS=--experimental-vm-modules npx jest
