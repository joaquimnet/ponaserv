<center>
<img src="https://raw.githubusercontent.com/joaquimnet/ponaserv/main/docs/public/logo.svg" width="256" height="256">
</center>

# ponaserv

[![NPM](https://img.shields.io/npm/v/ponaserv)](https://www.npmjs.com/package/ponaserv)

Easily map routes to request handlers.

## How to use

```javascript
/* server.js */
const { ponaserv } = require('ponaserv');
const express = require('express');
const path = require('path');

const app = express();

ponaserv(app, { services: path.join(__dirname, 'services') });

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
```

## Service example

```javascript
/* services/hello.js */
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

## Getting Started

Head to our [documentation](https://ponaserv.vercel.app) to learn more about ponaserv.

## License

Ponaserv is [MIT licensed](./LICENSE).