module.exports = {
  name: 'hello',
  routes: {
    'GET /': 'sayHello',
  },
  actions: {
    sayHello: {
      handler({ res }) {
        res.setHeader('Content-Type', 'text/plain');
        res.send('Hello World!');
      },
    },
  },
};
