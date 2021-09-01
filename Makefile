build:
	docker-compose up --build

dev-build:
	docker-compose  -f docker-compose.yml -f docker-compose.dev.yml up --build

dev:
	docker-compose  -f docker-compose.yml -f docker-compose.dev.yml up
	

stop:
	docker-compose down --rmi all

down:
	docker-compose down

delete:
	docker image prune -a -f