# Middleware

In Ponaserv each action can have a list of middleware functions that will be executed before the action handler.

## Adding middleware

You can define middleware functions in the `middleware` property of your action.

```js
const express = require('express');

module.exports = {
  name: 'hello',
  routes: {
    'GET /': 'sayHello',
  },
  actions: {
    sayHello: {
      middleware: [express.json(), (req, res, next) => {
        // Do something
        next();
      }],
      handler(req, res, next) {
        res.send('Hello World 2!');
      },
    },
  },
};
```
