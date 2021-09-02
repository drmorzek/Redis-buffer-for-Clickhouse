# Буферизация данных  БД ClickHouse с помощью Redis

База данных ClickHouse плохо справляется с частыми вставками, для правильной работы необходима буферизация данных. Данное приложение принимает по HTTP протоколу данные в формате JSON и отправляет пакетные вставки в базу данных ClickHouse в качестве буфера используя Redis

Необходимые требования для запуска прилжения

- Docker(Docker-compose)  
- Утилита make(не обязательно)  

## Установка

1. Клонировать репозиторий
```bash
git clone https://github.com/drmorzek/Redis-buffer-for-Clickhouse
cd Redis-buffer-for-Clickhouse
```

2. Переименовать файл .env.example в .env
```bash
ren .env.example .env
```

3. Запустить приложение
```bash
# напрямую через команду docker-compose
docker-compose up --build
или если docker image уже ранее были собраны
docker-compose up

#или c помощью make
make build

```

Если необходимо запустить приложение в режиме разработки с отслеживанием изменений в коде приложения
```bash
# напрямую через команду docker-compose
docker-compose  -f docker-compose.yml -f docker-compose.dev.yml up --build
или если docker image уже ранее были собраны
docker-compose  -f docker-compose.yml -f docker-compose.dev.yml up

#или c помощью make
make dev-build
или если docker image уже ранее были собраны
make dev

```

4. Для остановки приложения

```bash
# напрямую через команду docker-compose
docker-compose down 
или если необходимо удалить docker image которые ранее были собраны
docker-compose down --rmi all

#или c помощью make
make stop
или если необходимо удалить docker image которые ранее были собраны
make stop-delete

```

Чтоб удалить образы незадействованные в работе при остановке контейнера
```bash
# напрямую через команду docker-compose
docker image prune -a -f

#или c помощью make
make delete
```

## Переменные окружения в .env

HTTP_PORT - порт на котором запуститься HTTP сервер

LIGHTHOUSE_PORT - порт для веб-интерфеса визуально просмотра БД ClickHouse

REDIS_PORT - порт запуска сервера Redis

REDIS_COMMANDER_PORT - порт для веб-интерфеса визуально просмотра Redis


CLICKHOUSE_PORT - порт запуска сервера ClickHouse
CLICKHOUSE_DB - наименование БД в ClickHouse

!!!ВАЖНО!!!!
По деволту наименование БД в ClickHouse называется default.
Чтоб в ClickHouse создалась новая база данных необходимо в папке ./docker/clickhouse/initdb.d создать вайл init-db.sh со следующим содержимым
__________________________________________________
#!/bin/bash  
set -e  
clickhouse client -n <<-EOSQL  
    CREATE DATABASE <название новой базы данных>;  
EOSQL
__________________________________________________

или перейдя в браузере по ссылке http://localhost:8123/play (номер порта ClickHouse указан по умолчанию, если меняли - укажите корректный) и прописать в консоли команду
```bash
CREATE DATABASE <название новой базы данных>;
```

## JSON для отправки

Данное приложение принимает JSON по любому пути(роутинга нет) при отправке HTTP POST-запроса.
Отправлять необходимо только POST-запрос, на другие запросы будет ругаться.
Все ключи - обязательные. Если какого-либо ключа не будет в передаваемом JSON - вылетит ошибка
Сохраняемая структура данных JSON в массиве с ключом data может быть абсолютно любая.
Структура JSON должна быть такая:
```bash

{
    "table": #"наименование таблицы",
    "data" : [
        #"массив данных"
        {
            "date": "ddddd"
        },
    ],
    "max_buffer" : #максимальный буфер который будет храниться в Redis,
    "max_time": #максимальное время хранения в Redis
}

```




