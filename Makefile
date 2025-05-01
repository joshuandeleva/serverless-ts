start_db:
	docker compose up -d

stop_db:
	docker compose down

migrate:
	db-migrate up

migrate-down:
	db-migrate down

migrate-init:
	db-migrate create initialized --sql-file

create_migration:
	db-migrate create $(n) --sql-file
	
server:
	yarn run dev

.PHONEY: start_db stop_db server migrate migrate-down migrate-init create_migration

