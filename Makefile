DB_NAME=hontokun-db-1
APP_NAME=hontokun-backend-1
MYSQL_USER=user
MYSQL_PASSWORD=password
MYSQL_DATABASE=hontokun


# docker compose command
ps:
		docker compose ps

build:
		docker compose build --no-cache

network:
		docker network create -d bridge hontokun

up:
		docker compose up -d

down:
		docker compose down

# docker push

push:
		docker buildx  build --platform linux/amd64,linux/arm64 -t kouxi00/1000yen:latest --push .

db-shell:
		docker exec -it $(DB_NAME) mysql -u$(MYSQL_USER) -p$(MYSQL_PASSWORD) $(MYSQL_DATABASE)

app-shell:
		docker exec -it $(APP_NAME) /bin/sh