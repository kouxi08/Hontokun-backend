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
