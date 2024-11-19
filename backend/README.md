# Expense Tracker - Backend

This repository contains the Node.js backend for the Expense Tracker application. The backend provides a RESTful API for managing expenses, handles user authentication with JWT, and connects to a PostgreSQL database for persistent storage. It is containerized using Docker for seamless deployment and integration with the frontend and database.

---

## Features
- **Node.js** with **Express.js** for API development.
- **PostgreSQL** for data storage.
- **JWT Authentication** for secure user management.
- Containerized with **Docker** for consistent environments.
- Works seamlessly with the frontend via an **Nginx reverse proxy**.

---

## Prerequisites

Install [node](https://nodejs.org/en/download/). 

Example node install instructions for LTS node 16.x:
```
curl -sL https://deb.nodesource.com/setup_16.x | bash
sudo apt install -y nodejs
```

Check your install with `node -v && npm -v`

Install all packages with `npm install`

## Development Mode

Run using `node index.js`

Enviroment variables to connect to DB

  - `POSTGRES_HOST` The hostname for postgres database. (port will default to 5432 the default for Postgres)
  - `POSTGRES_USER` database user. Default: postgres
  - `POSTGRES_PASSWORD` database password. Default: postgres
  - `POSTGRES_DATABASE` database name. Default: postgres
  - `REQUEST_ORIGIN` to pass an url through the cors check. Default: https://example.com
  - `JWT key` To genrate token using secret key