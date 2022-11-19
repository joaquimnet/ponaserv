# Validation

Ponaserv uses [fastest-validator](https://npmjs.com/package/fastest-validator) to validate the request body and query parameters.

The validation rules you define in `params` property for each action will be tested against the request body, query strings and route parameters.

## Validation rules

You can define validation rules for your actions in the `params` property of your action.

```js
module.exports = {
  name: 'hello',
  routes: {
    'GET /': 'sayHello',
  },
  actions: {
    sayHello: {
      params: {
        name: { type: 'string', min: 3, max: 255 },
      },
      handler(req, res, next) {
        res.send(`Hello ${req.params.name}!`);
      },
    },
  },
};
```

## Validation errors

If the request body or query parameters are invalid, Ponaserv will return a `422 Unprocessable Entity` response with the validation errors.

```json
{
  "code": 422,
  "message": "Validation error",
  "errors": [
    {
      "type": "stringMin",
      "field": "name",
      "message": "The 'name' field must be at least 3 characters long",
      "expected": 3,
      "actual": 2
    }
  ]
}
```
