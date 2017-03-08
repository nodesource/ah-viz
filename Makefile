BIN=./node_modules/.bin
BUDO=$(BIN)/budo

ENTRY=client/client.js
CSS=--css client/index.css

watch:
	$(BUDO) $(ENTRY) $(CSS) --live -- -d

watch-noreload:
	$(BUDO) $(EXCLUDE_MODULES) $(ENTRY) $(CSS) -- -d

start:
	node server/app
