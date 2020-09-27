const { Router } = require('express');

const { requireFiles, getRoutes } = require('./functions');

async function loadServices(serviceDir, app) {
  const services = await requireFiles(serviceDir);

  for (const service of services) {
    if (!service.routes) continue;

    const routes = getRoutes(service);

    if (!routes.length) continue;

    const router = Router();
    routes.forEach(route => router[route.method](...route.args));
    app.use(router);
  }
}

module.exports = loadServices;
