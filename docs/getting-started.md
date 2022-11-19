# Getting Started

This guide will help you get a hello world api running.

## Install ponaserv and express.

Ponaserv is built on top of express. So you need to install both.

```bash
$ npm install ponaserv express
```

## Create your server

Create a `server.js` file and add the following code:

```js
const express = require('express');
const ponaserv = require('ponaserv');

const app = express();
ponaserv(app);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
```

## Create your first service

With Ponaserv you can create services that are loaded automatically. You can create a service by creating a file ending in `.service.js` in your services directory.

Create a service file and add the following code:

```js
# services/hello.service.js

module.exports = {
  name: 'hello',
  routes: {
    'GET /': 'sayHello',
  },
  actions: {
    sayHello: {
      handler(req, res, next) {
        res.send('Hello World!');
      },
    },
  },
};
```

## Run your server

Start your server by running the following command:

```bash
$ node server.js
```

## Test your service

Your Ponaserv API is now running on port 3000. You can test your service by making a GET request to `http://localhost:3000`.

Or you can navigate to <a href="http://localhost:3000" target="_blank" rel="noreferrer">localhost:3000</a> and you should see `Hello World` in your browser.
