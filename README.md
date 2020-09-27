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
module.exports = {
  name: 'hello-world',
  routes: {
    'GET /': 'sayHello',
    'GET /:message': 'specialHello',
    'POST /': 'jsonIsCool',
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
    }
  }
}
```

## Api

**ponaserv(servicesDir, app)**

Loads js files ending in .service.js as services.

| parameter | description |
| --- | --- |
| servicesDir | absolute path to your services directory |
| app | express app |
