DB_NAME=hontokun-db-1
APP_NAME=hontokun-backend-1
MYSQL_USER=user
MYSQL_PASSWORD=password
MYSQL_DATABASE=hontokun


# docker compose command
ps:
		docker compose ps

images:
		docker images

build:
		docker compose -f docker-compose.yaml -f docker-compose.dev.yaml build --no-cache

prod-build:
		docker compose -f docker-compose.yaml -f docker-compose.prod.yaml build --push

network:
		docker network create -d bridge hontokun

up:
		docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d

down:
		docker compose -f docker-compose.yaml -f docker-compose.dev.yaml down

push:
		docker compose -f docker-compose.yaml -f docker-compose.prod.yaml  push

db-shell:
		docker exec -it $(DB_NAME) mysql -u$(MYSQL_USER) -p$(MYSQL_PASSWORD) $(MYSQL_DATABASE)

app-shell:
		docker exec -it $(APP_NAME) /bin/sh