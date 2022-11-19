const express = require('express');
const { ponaserv } = require('../../dist');

const app = express();

ponaserv(app, {
  services: require('path').join(__dirname, 'services'),
  debug: true,
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
