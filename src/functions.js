const recursive = require('recursive-readdir');
const Validator = require('fastest-validator');

const VirtualSymbol = Symbol('Virtual Ponatech Service');

async function requireFiles(dir) {
  const files = await recursive(dir, ['!*.service.[tj]s']);
  const required = files.map(module.require);
  return required.map((r) => r.default || r);
}

function parseRouteName(route) {
  const [method, endpoint] = route.split(/ +/);
  return [method.toLowerCase().replace(/[^\w]/g, ''), endpoint || ''];
}

function getActionHandler(actionName, service) {
  if (typeof service.actions[actionName] === 'function') {
    return service[VirtualSymbol][actionName];
  }
  if (isObject(service.actions[actionName]) && service.actions[actionName].handler) {
    return service[VirtualSymbol][actionName];
  }
  return null;
}

function bindActionsAndMethods(service) {
  if (!isObject(service)) {
    return;
  }

  const virtualService = { ...service };
  service[VirtualSymbol] = virtualService;

  if (service.actions && isObject(service.actions)) {
    for (let actionName of Object.keys(service.actions)) {
      const action = service.actions[actionName];
      if (typeof action === 'function') {
        virtualService[actionName] = action.bind(virtualService);
      } else if (isObject(action) && typeof action.handler === 'function') {
        virtualService[actionName] = action.handler.bind(virtualService);
      }
    }
  }

  if (service.methods && isObject(service.methods)) {
    for (let method of Object.keys(service.methods)) {
      if (typeof service.methods[method] === 'function') {
        virtualService[method] = service.methods[method].bind(virtualService);
      }
    }
  }
}

function getMiddleware(actionItem) {
  const middleware = [];
  if (!isObject(actionItem) || actionItem === null) {
    return middleware;
  }
  if (actionItem.params) {
    const v = new Validator();
    middleware.push((req, res, next) => {
      let reqParams = {};
      if (req.body && isObject(req.body)) {
        reqParams = { ...reqParams, ...req.body };
      }
      if (req.query && isObject(req.query)) {
        reqParams = { ...reqParams, ...req.query };
      }
      if (req.params && isObject(req.params)) {
        reqParams = { ...reqParams, ...req.params };
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

  const actionHandler = getActionHandler(actionName, service);
  const middleware = getMiddleware(actionObj);

  return [method, endpoint, middleware, actionHandler, actionName];
}

function handlerWrapper(handler) {
  const handlerArgs = getArgs(handler);

  const isExpress = handlerArgs[0] && ['req', 'request'].includes(handlerArgs[0].toLowerCase());

  if (isExpress) {
    return handler;
  }

  return function wrappedHandler(req, res, next) {
    let reqParams = {};
    if (req.body && isObject(req.body)) {
      reqParams = { ...reqParams, ...req.body };
    }
    if (req.query && isObject(req.query)) {
      reqParams = { ...reqParams, ...req.query };
    }
    if (req.params && isObject(req.params)) {
      reqParams = { ...reqParams, ...req.params };
    }

    const ctx = { req, res, next, params: reqParams };
    handler(ctx);
  };
}

function getRoutes(service) {
  const routes = [];

  bindActionsAndMethods(service);

  for (const route of Object.keys(service.routes)) {
    const [method, endpoint, middleware, handler, actionName] = parseRouteHandlers(service, route);

    if (!handler) {
      throw new Error(`Handler for action ${actionName} not found in service ${service.name}`);
    }

    const wrappedHandler = handlerWrapper(handler);
    Object.defineProperty(wrappedHandler, 'name', { value: handler.name });

    routes.push({ method, args: [endpoint, ...middleware, wrappedHandler] });
  }

  return routes;
}

function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object;
}

function getArgs(func) {
  let matches = func.toString().match(/((?<=\().+?(?=\)))/);
  if (!matches) {
    matches = func.toString().match(/((?<=(async|^(?!async))).+(?=\s=>))/);
  }

  if (!matches) {
    return [];
  }

  const args = matches[1];

  // Split the arguments string into an array comma delimited.
  return args
    .split(',')
    .map(function (arg) {
      // Ensure no inline comments are parsed and trim the whitespace.
      return arg.replace(/\/\*.*\*\//, '').trim();
    })
    .filter(function (arg) {
      // Ensure no undefined values are added.
      return arg;
    });
}

module.exports = {
  requireFiles,
  parseRouteName,
  getActionHandler,
  getMiddleware,
  parseRouteHandlers,
  getRoutes,
  bindActionsAndMethods,
  getArgs,
  handlerWrapper,
  VirtualSymbol,
};
