# Original README
## Test backend assignment

Task is to create backend application in Node.js using any SQL database. This application should communicate with frontend via GraphQL. There is no need to do frontend in this assessment. You can use any libraries you may consider useful. The assessment is to create an application for book catalogue.

### Use cases:

- User should be able to register and log in.
- Logged in User should be able to add new book, edit existing book, and delete book. User should be able to “travel back” in time and see older state of any book.
- Anonymous user should be able to find some book by author name or book title.
- Pagination is not required but is big plus.

### Minimum data requirements:

- User: email, password
- Book: title, author, year of publication, genres, rating

You can model SQL schema as you consider best. The same applies for GraphQL schema.

### Additional informations:

- Feel free to use any additional library you might need for completing this project, or change structure or anything
- We would like to see, how will you solve this task in terms of end result precision, code quality & readability


# Project README
## Book Catalogue Backend app

Hello to the Book Catalogue Backend app! Read this README to get started with the project.

## Usage Overview

The app manages a simple book catalogue. You are able to register and after logging in, you can add, edit and delete books. Past versions of books are stored and history can be viewed. Anybody can search for books by author name or book title. To ensure servers functionality, a rate limiter is set for anonymous users.

## Tech Overview

The app is a NestJS(+TypeScript) project, using Vercel Postgres as the database hosting, while `drizzle` is used as an ORM of choice. Public API is exposed via GraphQL. Auth is handled using `passport` library. OpenTelemetry is set for monitoring. For developer convenience, linting and formatting is preconfigured for VS Code users. `jest` tests should be covering everything relevant in the codebase.

## Getting Started

Make sure to have Node.js and `npm` installed. Then:

```
nvm use
npm install
cp .env.example .env
```

Fill in the `.env` file with your secrets.

To develop the app:

```
npm run start:dev
```

To build and deploy the app:

```
npm run build
npm run start:prod
```

Other scripts are ready for you in the `package.json` file.

## Deployment

Vercel deployment config is preset for your convenience. Just make sure to install Vercel CLI and run `vercel` in the project root.