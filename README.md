This solution contains a RESTful API built using [NestJS](https://docs.nestjs.com/), [MikroORM](https://mikro-orm.io/) a TypeScript Object Relational Mapper, and [MongoDb](https://www.mongodb.com/) for persistence.

## Table of Contents
- [Installation](#installation)
- [How to Run](#how-to-run)
- [Running Tests](#running-tests)
- [Concessions and Decisions](#concessions-and-decisions)

## Installation

1. Install Node.js version `>= v20.10.0`. If you don't have node.js `>= v20.10.0` readily installed you can install NVM as per the following [instructions](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating). Once NVM is installed you can follow the instructions below to install a compatible Node.js version. You can check the available versions using `nvm ls-remote` and choose a version from the list. 
```bash
nvm use 20.10.0
nvm alias default 20.10.0
# You'll need to restart `bash` from terminal with `source ~/.bashrc` for each window or by closing and starting a new Terminal application.
```

2. Install MongoDB as instructed [here](https://www.mongodb.com/docs/manual/administration/install-community/). How you install MongoDB depends on your operating system. Visit the appropriate guide at the provided link for a compatible installation. Once you've MongoDB installed you should start your service on your local machine and ensure that MongoDB is running on port `27017`.

3. Now that you've the correct Node.js version install you can `git clone` the repository.
```bash
  git@github.com:tafadzwagonera/touraxis-nodejs-assignment.git
```

4. Install dependencies.
```bash
cd ~/path/to/touraxis-nodejs-assignment # Verify that you're in `touraxis-nodejs-assignment` directory.
npm i
```
Now that you've everything set up it's time to run the application.

## How To Run

To run the server, use the following commands

```bash
pwd # Verify that you're in `/path/to/touraxis-nodejs-assignment` directory
cp .env.example .env
vim .env # Enter value for environment variables and save. See Exhibit 1 for a minimal .env.
cat .env # Verify that `.env` has the correct values.
npm run start:dev
```

#### Exhibit 1
```bash
NO_COLOR=
MONGODB_URI=mongodb://127.0.0.1:27017/touraxis
NODE_ENV=development
PORT=3000
SWAGGER_API_BEARER_TOKEN=.... # A meaningful `uuid` of your choice. For example `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMONTY30DkwIiwibmFtZSI6IkpvaG4gRG91IiwiaXNTb2NpYWwiOnRydWv9.4pcPyMD09o1PSyXnrXCjTwXyr4BsezdI1AVTmud2fU4`.
```

At this point the server should  be running and ready to handle requests. You should see output logs of the following nature

```bash
[HH:MM:ss] File change detected. Starting incremental compilation...

[HH:MM:ss] Found 0 errors. Watching for file changes.

[Nest] 64090  - dd/MM/yyyy, HH:MM:ss     LOG [NestFactory] Starting Nest application...
[Nest] 64090  - dd/MM/yyyy, HH:MM:ss     LOG [InstanceLoader] HttpModule dependencies initialized +24ms
[Nest] 64090  - dd/MM/yyyy, HH:MM:ss     LOG [InstanceLoader] ConfigHostModule dependencies initialized +1ms
```

## Running Tests

To run tests, use the following commands

```bash
cp .env.example .env.test
vim .env.test # Enter value for environment variables and save. See Exhibit 2 for a minimal `.env.test`
cat .env.test # Verify that `.env.test` has the correct values.
```

#### Exhibit 2
```bash
MONGODB_URI=mongodb://127.0.0.1:27017/test
```
Then run the tests

```bash
$ npm run test
```

# Concessions and Decisions
## Migrations
I acknowledge that in a production environment, every modification to an entity should be accompanied by a migration strategy. However, for the purposes of this exercise, I decided not to implement them. Additionally, the combination of MikroORM and NestJS configuration presented some challenges in navigating the migration setup.  While I recognize the importance of migrations, I opted to focus my efforts on other aspects of the technical assessment due to the time constraints and the optional nature of migrations in this context.

## Testing
The test coverage is intentionally limited to ensure I address a broad range of the technical assessment criteria. The current implementation serves as a starting point for my testing approach. Ideally, I would have implemented [end-to-end](https://docs.nestjs.com/fundamentals/testing#end-to-end-testing) testing for a number of endpoints.