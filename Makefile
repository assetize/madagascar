test:
	@./node_modules/mocha/bin/mocha --recursive -R spec --es_staging $(if $(g), -g "$(g)")

test_coverage:
	@./node_modules/istanbul/lib/cli.js cover --report text ./node_modules/mocha/bin/_mocha -- --recursive -R spec

.PHONY: test
