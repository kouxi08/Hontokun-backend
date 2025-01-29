DB_NAME = hontokun-db
APP_NAME = hontokun-backend
MYSQL_USER = user
MYSQL_PASSWORD = password
MYSQL_DATABASE = hontokun

COMPOSE = docker/


ps:
		docker compose -f ${COMPOSE}docker-compose.yaml ps

images:
		docker images

network:
		docker network create -d bridge hontokun

# build & push

build:
		docker compose -f ${COMPOSE}docker-compose.yaml -f ${COMPOSE}docker-compose.dev.yaml build --no-cache

prod-build:
		docker compose -f ${COMPOSE}docker-compose.yaml -f ${COMPOSE}docker-compose.prod.yaml build --push

# up & down

up:
		docker compose -f ${COMPOSE}docker-compose.yaml -f ${COMPOSE}docker-compose.dev.yaml up -d

down:
		docker compose -f ${COMPOSE}docker-compose.yaml -f ${COMPOSE}docker-compose.dev.yaml down

#exec

db-shell:
		docker exec -it $(DB_NAME) mysql -u$(MYSQL_USER) -p$(MYSQL_PASSWORD) $(MYSQL_DATABASE)

app-shell:
		docker exec -it $(APP_NAME) /bin/bash