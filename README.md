
# ChanChan

# ChanChan - A awesome website + ERP admin panel

[![N|Solid](https://firebasestorage.googleapis.com/v0/b/chanchan-368709.appspot.com/o/others%2Fchanchan-01.jpg?alt=media&token=d67b2d45-df59-456a-90d1-076b0e8d7331)](https://firebasestorage.googleapis.com/v0/b/chanchan-368709.appspot.com/o/others%2Fchanchan-01.jpg?alt=media&token=d67b2d45-df59-456a-90d1-076b0e8d7331)

The inspiration of this side project is from my best friend. Since her business just start-up, and ask me build one ERP system cloud help her recording cost and item manage.

🔗 [Demo Link](https://chan-web.onrender.com)
- test account/password : `test@test.com `/ `12qwaszx!`

🔗 [Backed Source code](https://github.com/backas36/chan-server)

## Table of Content

- [Project Status](#project-status)
- [Technologies](#technologies)
- [Tools I used](#tools-i-used)
- [API Doc](#api-doc)
- [Modules](#modules)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Summary](#summary)
- [Others](#others)

## Project Status

The project status is in staging phase, backend, database, Redis, and static website all render in render.com.

## Technologies

- Frontend
  - react hooks, react-router-dom v6, redux-toolkit, rtk query, Material UI, google oauth
- Backend
  - express, knex, postgreSql, redis
- Deploy
  - docker for local development
- Tools
  - VS Code for frontend, intelliJ IDEA for backend.

## Tools I used

- bcrypt, google-auth, jsonwebtoken, express-rate-limit
- http-errors
- knex, pg, redis
- loadash, uuid
- nodemailer
- winston, winston-daily-rotate-file, morgan
- nodemon

## API Doc
**Root path:**  `/`


|  Method  |  path |  Description |
|  ------ |  ----  |   -----------  |  
|  post  |  `register`  | user submit form to register a new account  |  
|  post  |  `activate-account`  | user submit to activate the account |
|  post  |  `reset-password`  | submit email to send reset password link |
|  post  |  `active-reset-password`  |user submit to reset the password |


### path : `/auth`
|  Method  |  path |  Description |
|  ------ |  ----  |  -----------  |  
|  get  |  `/verify`  |  verify user and response account detail only necessary information |  
|  get  |  `/verify/google-login`  | user login with google one tap and verify account to response account detail only necessary information, and tokens |
|  post  |  `/login`  | user login and response tokens|
|  post  |  `/logout`  | user logout and clean token in Redis|
|  post  |  `/refresh`  | verify old refresh token and response new refresh token|

### path : `/me`
|  Method  |  path |  Description |
|  ------ |  ----  | -----------  |  
|  get  |  `/`  |  user get own account detail  |  
|  patch  |  `/password`  | user change password |
|  patch  |  `/profile`  | user update own account detail|

### path : `/users`
|  Method  |  path |  Description |
|  ------ |  ----  | -----------  |  
|  get  |  `/`  |  users list  |  
|  get  |  `/:userId`  |  response user detail by user id  |  
|  post  |  `/`  | create new user, and send activate link to the new user |
|  patch  |  `/:userId`  | update user detail by user id|
|  delete  |  `/:userId`  | soft delete user detail by user id|
|  get  |  `/resend-activate/:userId`  | resend activate email to user|

### path : `/action-log`
|  Method  |  path |  Description |
|  ------ |  ----  |  -----------  |  
|  get  |  `/`  |  users actions log list  |  
|  get  |  `/:logId`  |  response action log detail by  id |


## Modules
- Authentication ✔️
- Me ✔️
- User ✔️
- Actions Log ✔️
- Inventory (building ...)
- Suppliers (building ...)

## Features
- [x] Auto send activate link in mail to new user when manage create a user.
- [x] Authentication by JWT token for access token and refresh token.
- [x] Keep refresh tokens in Redis until it expired.
- [x] Keep activate account tokens, and reset password tokens in Redis until it expired.
- [x] Limit permission by user status if route need.
- [x] Manage users, and limit permission each route by user role.
  ### TODO
  - [ ] Manage inventory, and limit permission each route by user role
  - [ ] Manage suppliers, and limit permission each route by user role
  - [ ] Update to batch crud each route.

## Folder structure
- config
  - db config, cors options config, Redis config, other configs.
- controllers
    - handles request and return response
- middleware
    - some helper functions for handle incoming request.
    - eg. validate user role, status, and JWT, logger, error handle.
- models
    - database interface of each table
- routes
    - routes manager for each module
- services
    - the layer between the controller and the model
- utils
    - some helper functions, or constants for global.

## Summary
It's so excited to build this backend project by myself. I use some experience when I worked in the project. Like,  I add services layer for handling request and response, it's more clean code, and more easy to debug, everything it's much better.

It's so much things I need to learn as a web developer, thanks I have this experience to improve my skill of backend.

The conclusion of this project, I implement every thing in enterprise level as possible even it just a side project. So I learned a lot of skill, and use much tool I haven't used before, like Redis, docker, or other react eco system library.

## Others

> It's in staging phase in current, and it render in render.com by free plan, so sometime it would response very slowly.


> Every document or code would be change since in staging phase now.

🔗 [Auth Flow Chart In Backend](https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&edit=_blank&layers=1&nav=1&title=chan-web-auth-flow#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1XCMsOnNDbtGJB0s7oQrJc-eHcFnyPCys%26export%3Ddownload)

🔗 [DB Model In Backend](https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&edit=_blank&layers=1&nav=1&title=chan-db#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1AIxiGyvhMsHa4MW-AChCgUF0rHuMfVa-%26export%3Ddownload)