<p align="center">
  <a href="https://ponaserv.vercel.app" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://ponaserv.vercel.app/logo.svg" alt="Ponaserv logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/ponaserv"><img src="https://img.shields.io/npm/v/ponaserv.svg" alt="npm package"></a>
  <a href="https://github.com/joaquimnet/ponaserv/actions/workflows/main.yml"><img src="https://github.com/joaquimnet/ponaserv/actions/workflows/main.yml/badge.svg?branch=main" alt="build status"></a>
  <a href="https://github.com/joaquimnet/ponaserv/blob/main/LICENSE.md"><img src="https://img.shields.io/npm/l/ponaserv" alt="license"></a>
</p>
<br/>

# Ponaserv

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