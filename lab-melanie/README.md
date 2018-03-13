# 41 O-Auth

This is an application that provides a link for a user to sign up/sign in using O-authorization. The user must click on the link at the home page and select a Google account to use for authentication, which in turns provides authorization for that user with a token stored as a cookie.

----

## Getting started

Copy this repository to your local computer and install node and dependencies with `npm i` from both the `frontend` and `backend` directories. Navigate to `lab-melanie/backend` and run MongoDB with `npm run start-db`. In another tab in your terminal, navigate to the same `lab-melanie/backend` directory and run nodemon with `npm run start:watch`. In a third tab, navigate to `lab-melanie/frontend` and run live server `live-server`. From your browser, type in the address:

```
http://localhost:8080
```

This will bring you to the page with the link to log-in/sign up.

----

## Environment Variables:

```
backend:
.env file

PORT=3000
MONGODB_URI='mongodb://localhost/personality'
CLIENT_URL='http://localhost:8080'
API_URL='http://localhost:3000'
APP_SECRET=SEEKRET


frontend:
.dev.env file:

NODE_ENV=dev
API_URL="http://localhost:3000"
```
