build:
	docker-compose up --build

dev-build:
	docker-compose  -f docker-compose.yml -f docker-compose.dev.yml up --build

dev:
	docker-compose  -f docker-compose.yml -f docker-compose.dev.yml up
	

stop:
	docker-compose down 

stop-delete:
	docker-compose down --rmi all

delete:
	docker image prune -a -f