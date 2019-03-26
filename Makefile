start:
	npx babel-node -- src/bin/gendiff.js -h

install:
	npm install

publish:
	npm publish

lint:
	npx eslint .

test:
	npm run test

testwatch:
	npm run test:watch

testcoverage:
	npm test test:coverage

testnative:
	npx babel-node -- src/bin/gendiff.js __tests__/__fixtures__/before.json __tests__/__fixtures__/after.json




