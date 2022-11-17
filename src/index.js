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

  const loadedServices = [];

  for (const service of services) {
    if (options.debug) {
      console.log(`PONA > Loading service ${service.name}`);
      if (loadedServices.includes(service.name)) {
        console.log(
          `PONA > ERROR: Service ${service.name} already loaded. Please change the name to be unique.`,
        );
        continue;
      }
      loadedServices.push(service.name);
    }

    if (!service.routes) {
      continue;
    }

    const routes = getRoutes(service);

    if (!routes.length) {
      continue;
    }

    const router = Router();
    routes.forEach((route) => {
      if (options.debug) {
        console.log(`PONA > Loading route ${route.method.toUpperCase()} ${route.args[0]}`);
      }
      router[route.method](...route.args);
    });
    app.use(router);
  }
  app.use(e404);
}

module.exports = ponaserv;
