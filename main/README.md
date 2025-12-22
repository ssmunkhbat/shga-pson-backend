
## Node version: v20

## Description

Хоригдогсдын бүртгэл, хяналтын нэгдсэн систем

## Tech stack

- [Nestjs](https://docs.nestjs.com)
- [Typeorm](https://typeorm.io/docs/getting-started)
- [Oracle DB]()

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## DOCKER
- docker-compose -p shga-pson-docker up    --> start containers
- docker-compose -p shga-pson-docker up -d --> start containers in background
- docker-compose down
- docker-compose logs