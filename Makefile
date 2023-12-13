dev:
	npm run dev

deploy:
	npm run deploy


wrangler := npx wrangler
DATABASE_NAME ?= "hono-htmx-cloudflare"
# execute at once
db-create:
	$(wrangler) d1 create $(DATABASE_NAME) --location apac