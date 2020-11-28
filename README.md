# ponaserv

Easily map routes to request handlers.

## How to use

```javascript
const ponaserv = require('ponaserv');
const express = require('express');
const path = require('path');

const app = express();

ponaserv(path.join(__dirname, './services'), app);

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
```

## Service example

```javascript
const express = require('express');

module.exports = {
  name: 'hello-world',
  routes: {
    'GET /': 'sayHello',
    'GET /:message': 'specialHello',
    'POST /': 'jsonIsCool',
    'GET /math': 'math',
  },
  actions: {
    sayHello(req, res) {
      res.send('Hello World!');
    },
    specialHello(req, res) {
      const { message } = req.params;
      res.send(message.toUpperCase());
    },
    jsonIsCool: {
      middleware: [express.json()],
      handler(req, res) {
        const { body } = req;
        res.send({ yourData: body });
      }
    },
    math: {
      middleware: [express.json()],
      params: {
        a: 'number',
        b: 'number',
        $$strict: true,
      },
      handler(req, res) {
        const params = {...req.params, ...req.body, ...req.query};
        res.send(this.calc(params.a, params.b));
      }
    }
  },
  methods: {
    calc(a, b) {
      return a + b;
    }
  }
}
```

## Api

**ponaserv(app, opts)**

Loads js files ending in .service.js as services.

| parameter     | description                              |
| ------------- | ---------------------------------------- |
| app           | express app                              |
| opts.services | absolute path to your services directory |
| opts.debug    | set to true if you want debug logs       |
