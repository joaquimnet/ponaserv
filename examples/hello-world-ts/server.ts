import * as express from 'express';
import { ponaserv } from '../../dist';
import { join } from 'path';

const app = express();

ponaserv(app, {
  services: join(__dirname, 'services'),
  debug: true,
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
