# Expensetracker-app

This app is designed to get experience regarding full stack development. it utilizes a React.js frontend and a Node.js. Furthermore it follows  a Docker approach so elements are broken down into images which are run on containers.

A reverse proxy is also implemented to map the requests, init.sql is used for database initilzation

More info on fronend/backend in file directory README file

# Features

## Frontend
- **React.js** for building dynamic, responsive user interfaces.
- **Integration with Backend API** for expense management and authentication.
- **State Management** using React Hooks for handling UI interactions and API responses.
- **Containerized with Docker** for easy deployment and integration with the backend and database.
- Works seamlessly with the backend via an **Nginx reverse proxy**.

## Backend
- **Node.js** with **Express.js** for API development.
- **PostgreSQL** for data storage.
- **JWT Authentication** for secure user management.
- Containerized with **Docker** for consistent environments.
- Works seamlessly with the frontend via an **Nginx reverse proxy**.

# Prerequisites

Install Docker:

https://docs.docker.com/engine/install/

## Development mode
### Version 1 -> to run the project

If you want prebuild images included in code
-  `docker compose up`

If you are going to edit the files you need to change the image name in docker compose
-  `docker compose build`
-  `docker compose up`



