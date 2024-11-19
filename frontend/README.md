# Expense Tracker - Frontend

This repository contains the React.js frontend for the Expense Tracker application. It is designed to demonstrate full-stack development skills and is containerized using Docker. The frontend interacts with the backend API and is reverse proxied through an Nginx server.

## Features
- Built with React.js.
- Integrated with an Nginx reverse proxy for routing.
- Easy deployment via Docker.
- Communicates seamlessly with the backend.

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


First you need to build the static files with `npm run build`

This will generate them into `build` folder.

An example for serving static files:

Use npm package called serve to serve the project in port 5000:
- install: `npm install -g serve`
- serve: `serve -s -l 5000 build`

Test that the project is running by going to <http://localhost:5000>
---

to connect to backend

By default the expected path to backend is /api. This is where the application will send requests. 
To manually configure api path run with `REACT_APP_BACKEND` environment value set, for example `REACT_APP_BACKEND=http://example.com npm run build`