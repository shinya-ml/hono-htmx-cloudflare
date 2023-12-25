WRANGLER := npx wrangler
D1 := npx wrangler d1
DB_NAME := hono-remix-app

d1-create:
	$(D1) create $(DB_NAME) --location apac

FILE_NAME ?=
d1-migrate-new:
	$(D1) migrations create $(DB_NAME) $(FILE_NAME)

# うっかり防止でデフォルトローカル適用にしておく
LOCAL ?= true
d1-migrate-up:
	$(D1) migrations apply $(DB_NAME) --local $(LOCAL)

QUERY ?= PRAGMA table_list
d1-exec:
	$(D1) execute $(DB_NAME) --command '$(QUERY)' --local $(LOCAL)