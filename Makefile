BIN=./node_modules/.bin
BUDO=$(BIN)/budo

ENTRY=client/client.js
CSS=--css client/index.css
PORT=-p 9911

watch:
	$(BUDO) $(ENTRY) $(CSS) $(PORT) --live -- -d

watch-noreload:
	$(BUDO) $(EXCLUDE_MODULES) $(ENTRY) $(CSS) $(PORT) -- -d

start:
	node server/app
