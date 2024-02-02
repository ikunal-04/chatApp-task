# Chat-App

MERN Stack based chat-application which let users to chat, form groups and also them chat using voice messages.

## Installation

Setting up in Local enviroment:

Firstly, clone the repository:

```shell
git clone https://github.com/ikunal-04/chatApp-task.git
```

After, making the clone run `cd chatApp-task`.

Now let's install all the dependencies:

First, let's install backend dependencies:

```shell
cd backend/
npm install
```

Now, frontend dependencies:

```shell
cd ..
cd frontend/
npm install
```

Also, as this project is not deployed yet. You have to provide the database URL, JWT secret key and JWT lifetime. See the example below:

Env file for backend:
```shell
MONGODB_URI="your mongodb url"
JWT_SECRET="secret"
JWT_LIFETIME="7d"
```

Env file for frontend:

```shell
REACT_APP_URL=http://localhost:4000
```

That's it!! Congrats you've succesfully setup the project locally.

Now to run this on machine follow the following steps:

To start backend:

```shell
cd backend/
node index.js
```

To start frontend:

```shell
cd frontend/
npm start
```

Features/Bug fixes needs to be implemented:

- [ ] Voice message sending button
- [ ] Bug while forming a group chat
- [ ] Video messages sending feature 
- [ ] Make users setUp app locally without making .env file.

Happy Coding!! 