build:
	docker-compose up --build

dev:
	docker-compose  -f docker-compose.yml -f docker-compose.dev.yml up --build
	

stop:
	docker-compose down --rmi all

delete:
	docker image prune -a -f