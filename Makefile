# docker compose command
ps:
		docker compose ps

build:
		docker compose build --no-cache

up:
		docker compose up -d

down:
		docker compose down

# docker push

push:
		docker buildx  build --platform linux/amd64,linux/arm64 -t kouxi00/1000yen:latest --push .
