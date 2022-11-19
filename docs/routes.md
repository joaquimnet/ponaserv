# Routes

Each service can declare routes that are automatically loaded by Ponaserv. You can declare routes in the `routes` property of your service.

```js
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

## Route syntax

Routes are declared in the following format:

```js
'HTTP_METHOD /path': 'actionName'
```

The `HTTP_METHOD` can be any valid HTTP method. The `path` is the path of the route. The `actionName` is the name of the action that will handle the request.
