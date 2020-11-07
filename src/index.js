const { Router } = require('express');
const root = require('app-root-path');
const path = require('path');

const { requireFiles, getRoutes } = require('./functions');

async function ponaserv(app, options = {}) {
  const serviceDir = options.services || path.join(root, 'services');
  const e404 =
    options[404] && typeof options[404] === 'function'
      ? options[404]
      : (req, res) => res.status(404).json({ message: 'Not found' });

  const services = await requireFiles(serviceDir);

  for (const service of services) {
    if (!service.routes) continue;

    const routes = getRoutes(service);

    if (!routes.length) continue;

    const router = Router();
    routes.forEach((route) => router[route.method](...route.args));
    router.use(e404);
    app.use(router);
  }
}

module.exports = ponaserv;
