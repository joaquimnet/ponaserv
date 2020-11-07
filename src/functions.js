const recursive = require('recursive-readdir');
const Validator = require('fastest-validator');

async function requireFiles(dir) {
  const files = await recursive(dir, ['!*.service.js']);
  return files.map(require);
}

function parseRouteName(route) {
  const [method, endpoint] = route.split(/ +/);
  return [method.toLowerCase().replace(/[^\w]/g, ''), endpoint || ''];
}

function getActionHandler(actionItem) {
  if (typeof actionItem === 'function') {
    return actionItem;
  }
  if (isObject(actionItem) && actionItem.handler) {
    return actionItem.handler;
  }
  return null;
}

function getMiddleware(actionItem) {
  const middleware = [];
  if (actionItem.params) {
    const v = new Validator();
    middleware.push((req, res, next) => {
      let reqParams = {};
      if (req.body && isObject(req.body)) {
        reqParams = {...reqParams, ...req.body};
      }
      if (req.query && isObject(req.query)) {
        reqParams = {...reqParams, ...req.query};
      }
      const result = v.validate(reqParams, actionItem.params);
      if (result === true) {
        return next();
      }
      return res.status(422).json(result);
    });
  }
  if (!isObject(actionItem) || !actionItem.middleware || !Array.isArray(actionItem.middleware)) {
    return middleware;
  }
  return [...actionItem.middleware, ...middleware];
}

function parseRouteHandlers(service, routeName) {
  const [method, endpoint] = parseRouteName(routeName);

  const actionName = service.routes[routeName];
  const actionObj = service.actions[actionName];

  const actionHandler = getActionHandler(actionObj);
  const middleware = getMiddleware(actionObj);

  return [method, endpoint, middleware, actionHandler, actionName];
}

function getRoutes(service) {
  const routes = [];

  for (const route of Object.keys(service.routes)) {
    const [method, endpoint, middleware, handler, actionName] = parseRouteHandlers(service, route);

    if (!handler) {
      throw new Error(`Handler for action ${actionName} not found in service ${service.name}`);
    }

    routes.push({ method, args: [endpoint, ...middleware, handler] });
  }

  return routes;
}

function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object;
}

module.exports = {
  requireFiles,
  parseRouteName,
  getActionHandler,
  getMiddleware,
  parseRouteHandlers,
  getRoutes,
};
