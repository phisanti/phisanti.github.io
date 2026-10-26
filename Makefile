.PHONY: help install dev build preview clean check new-post new-project

help:
	@echo "Targets: install dev build preview clean check new-post new-project"
	@echo "  make new-post TITLE=\"...\"   make new-project NAME=\"...\""

install:
	@if [ -f package-lock.json ]; then npm ci; else npm install; fi

dev:
	npx astro dev --host localhost --port 4321

build:
	npx astro build

preview:
	npx astro preview

clean:
	rm -rf dist .astro

check:
	npx astro check
	$(MAKE) build
	node scripts/check-urls.mjs
	npx playwright test

new-post:
	@test -n "$(TITLE)" || { echo "usage: make new-post TITLE=\"My title\""; exit 1; }
	node scripts/new-post.mjs "$(TITLE)"

new-project:
	@test -n "$(NAME)" || { echo "usage: make new-project NAME=\"My project\""; exit 1; }
	node scripts/new-project.mjs "$(NAME)"
