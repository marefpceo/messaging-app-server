# Messaging App Server

<center style='font-size:12pt'>

<a href='/CHANGELOG.md'>Changelog</a>

</center>

---

## Introduction

Backend API for mChat Messaging App, a messaging app project as part of The Odin Project curriculum.

## Technologies Used

[![My Skills](https://skillicons.dev/icons?i=nodejs,express,postgres,prisma)](https://skillicons.dev)

- [NodeJS](https://nodejs.org/) is a cross-platform, open-source JavaScript runtime environment that can run on Windows, Linux, Unix, macOS, and more.

- [Express JS](https://expressjs.com/) or simply Express, is a back end web application framework for building RESTful APIs with Node.js.

- [PostgreSQL](https://www.postgresql.org/) is a free and open-source relational database management system emphasizing extensibility and SQL compliance.

- [Prisma](https://www.prisma.io/) is a modern ORM with a fully managed Postgres database.

## Installation

The instructions below will guide you through installing the api locally.

### Perquisites

Verify that you have Node.js, NPM and PostgreSQL installed.

1. Open a terminal by pressing `Ctrl+Alt+T`.

2. **Node:**

   ```sh
   node -v (or --version)
   ```

   _If not installed, download and installation procedures can be found at [Node.js][Nodejs-url] website._

3. **NPM**

   ```sh
   npm -v (or --version)
   ```

   _If not installed, download and installation procedures can be found at [NPM][NPM-url] website._

4. **PostgreSQL**

   ```sh
   psql -V (or --version)
   ```

   _If not installed, download and installation procedures can be found at [PostgreSQL][postgres-url] website._

### Database Setup

To setup your PostgreSQL database, create a new database named `mchat_messaging`.

```sh
createdb mchat_messaging;
```

### Installation Procedures

1. Open a terminal by pressing `Ctrl+Alt+T`.

2. Clone the repo
   ```sh
   git clone https://github.com/marefpceo/messaging-app-server.git
   ```
3. Change directory to `messaging-app-server`
   ```sh
   cd messaging-app-server
   ```
4. Install modules and dependencies
   ```sh
   npm install
   ```
5. Generate Prisma Client
   ```sh
   npx prisma generate
   ```
6. Create an `.env` file in the root directory
   ```sh
   touch .env
   ```
7. Add the following variables and values to `.env`
   ```sh
   DATABASE_URL="postgresql://<username>:<password>@localhost:5432/mchat_messaging"
   NODE_ENV="development"
   SESSION_SECRET="some-secret-string"
   ```
8. Start the server in development mode.
   ```sh
   npm run serverstart
   ```

## Endpoints

| Method   | Description                                   |
| -------- | --------------------------------------------- |
| `GET`    | method used to request data from the server   |
| `POST`   | method used to send data to the server        |
| `DELETE` | method used to delete an item from the server |

| Method   | URL                                 | Description                                            |
| -------- | ----------------------------------- | ------------------------------------------------------ |
| `GET`    | `/session-status`                   | provides user status (active/ inactive)                |
| `POST`   | `/signup`                           | creates a new user and logs them in                    |
| `POST`   | `/login`                            | verifies user email and password and then logs them in |
| `POST`   | `/logout`                           | logs the user out and terminates the session           |
| `GET`    | `/user/:userId/edit-profile`        | gets the user's profile settings                       |
| `PUT`    | `/user/:userId/edit-profile`        | updates the user's profile settings                    |
| `DELETE` | `/user/:userId/edit-profile`        | delete user profile                                    |
| `GET`    | `/contact`                          | gets a global list of contacts                         |
| `POST`   | `/contact/add`                      | add a contact to current user's list                   |
| `DELETE` | `/contact/:username/delete`         | removes contact from user's list                       |
| `GET`    | `/contact/:username/contact-list`   | gets user's list of contacts                           |
| `GET`    | `/message/:username/messages`       | gets all messages for current user (sent/ r'cvd)       |
| `GET`    | `/message/:username/create-message` | gets info needed to create new message                 |
| `POST`   | `/message/:username/create-message` | creates a new message                                  |
| `DELETE` | `/message/:username/message/delete` | deletes message from user's view for later deletion    |

[Nodejs-url]: https://nodejs.org/en/download
[NPM-url]: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
[postgres-url]: https://www.postgresql.org/download/
