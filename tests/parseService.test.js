/* eslint-disable no-unused-vars */
const {
  getActionHandler,
  getMiddleware,
  parseRouteName,
  parseRouteHandlers,
  getRoutes,
  bindActionsAndMethods,
  getArgs,
  handlerWrapper,
  VirtualSymbol,
} = require('../src/functions');

describe('getActionHandler ->', () => {
  test('should get handler if function', () => {
    const service = {
      name: 'user',
      actions: {
        be() {},
        async nice() {},
      },
    };
    bindActionsAndMethods(service);
    expect(getActionHandler('be', service)).toBe(service[VirtualSymbol].be);
    expect(getActionHandler('nice', service)).toBe(service[VirtualSymbol].nice);
  });

  test('should get handler if object', () => {
    const service = {
      name: 'user',
      actions: {
        be: {
          handler() {},
        },
        nice: { async handler() {} },
      },
    };
    bindActionsAndMethods(service);
    expect(getActionHandler('be', service)).toBe(service[VirtualSymbol].be);
    expect(getActionHandler('nice', service)).toBe(service[VirtualSymbol].nice);
  });
});

describe('getMiddleware ->', () => {
  test('should return empty array if no middleware provided', () => {
    const actionItem1 = null;
    const actionItem2 = {};
    const actionItem3 = { middleware: null };
    expect(getMiddleware(actionItem1)).toEqual([]);
    expect(getMiddleware(actionItem2)).toEqual([]);
    expect(getMiddleware(actionItem3)).toEqual([]);
  });

  test('should return an array of middlewares', () => {
    const middleware = () => {};
    const actionItem1 = { middleware: [middleware] };
    const actionItem2 = { middleware: [middleware, middleware] };
    expect(getMiddleware(actionItem1)).toEqual([middleware]);
    expect(getMiddleware(actionItem2)).toEqual([middleware, middleware]);
  });
});

describe('parseRouteName ->', () => {
  test('should return the correct method name', () => {
    const route1 = 'GET /user';
    const route2 = 'POST /user';
    const route3 = 'DELETE /user';
    const route4 = 'PUT /user';
    const route5 = 'PATCH /user';
    expect(parseRouteName(route1)[0]).toEqual('get');
    expect(parseRouteName(route2)[0]).toEqual('post');
    expect(parseRouteName(route3)[0]).toEqual('delete');
    expect(parseRouteName(route4)[0]).toEqual('put');
    expect(parseRouteName(route5)[0]).toEqual('patch');
  });
  test('should return the correct endpoint', () => {
    const route1 = 'GET /';
    const route2 = 'POST /hello';
    const route3 = 'DELETE /photo/:id';
    const route4 = 'PUT /user/:id';
    const route5 = 'PATCH /user/friends';
    const route6 = 'GET ';
    const route7 = 'GET';
    expect(parseRouteName(route1)[1]).toEqual('/');
    expect(parseRouteName(route2)[1]).toEqual('/hello');
    expect(parseRouteName(route3)[1]).toEqual('/photo/:id');
    expect(parseRouteName(route4)[1]).toEqual('/user/:id');
    expect(parseRouteName(route5)[1]).toEqual('/user/friends');
    expect(parseRouteName(route6)[1]).toEqual('');
    expect(parseRouteName(route7)[1]).toEqual('');
  });
});

describe('parseRouteHandlers ->', () => {
  test('should return the correct values', () => {
    const service = {
      name: 'users',
      routes: {
        'GET /': 'getUser',
      },
      actions: {
        getUser() {},
      },
    };

    bindActionsAndMethods(service);

    const [method, endpoint, middleware, actionHandler, actionName] = parseRouteHandlers(
      service,
      'GET /',
    );

    expect(method).toEqual('get');
    expect(endpoint).toEqual('/');
    expect(middleware).toEqual([]);
    expect(actionHandler).toBe(service[VirtualSymbol].getUser);
    expect(actionName).toEqual('getUser');
  });
});

describe('getRoutes ->', () => {
  test('should return the correct routes', () => {
    const service = {
      name: 'users',
      routes: {
        'GET /users': 'getUser',
        'POST /user': 'createUser',
      },
      actions: {
        getUser() {},
        createUser: {
          middleware: [() => {}],
          handler() {},
        },
      },
    };

    const routes = getRoutes(service);

    expect(routes.length).toEqual(2);

    expect(routes[0].method).toEqual('get');
    expect(routes[1].method).toEqual('post');

    expect(routes[0].args[0]).toEqual('/users');
    expect(routes[1].args[0]).toEqual('/user');

    expect(routes[1].args[1]).toBe(service.actions.createUser.middleware[0]);

    expect(routes[0].args[1].name).toBe(service[VirtualSymbol].getUser.name);
    expect(routes[1].args[2].name).toBe(service[VirtualSymbol].createUser.name);
  });
});

describe('binding ->', () => {
  test('should bind actions and methods to the service', () => {
    const service = {
      name: 'users',
      routes: {
        'GET /users': 'getUser',
        'POST /user': 'createUser',
      },
      actions: {
        getUser() {
          return this.getString();
        },
        createUser: {
          middleware: [() => {}],
          handler() {
            return this.getNumber();
          },
        },
      },
      methods: {
        getString() {
          return 'hello';
        },
        getNumber() {
          return 2;
        },
      },
    };

    getRoutes(service);

    expect(service[VirtualSymbol].getUser()).toEqual('hello');
    expect(service[VirtualSymbol].createUser()).toEqual(2);
  });
});

describe('getArgs ->', () => {
  test('should correctly detect (req, res)', () => {
    const a = function (req, res) {};
    const b = (req, res) => {};
    const c = async (req, res) => {};
    const d = async function (req, res) {};

    expect(getArgs(a)).toEqual(['req', 'res']);
    expect(getArgs(b)).toEqual(['req', 'res']);
    expect(getArgs(c)).toEqual(['req', 'res']);
    expect(getArgs(d)).toEqual(['req', 'res']);
  });
  test('should correctly detect (req, res, next)', () => {
    const e = (req, res, next) => {};
    const f = function (req, res, next) {};
    const g = async (req, res, next) => {};
    const h = async function (req, res, next) {};

    expect(getArgs(e)).toEqual(['req', 'res', 'next']);
    expect(getArgs(f)).toEqual(['req', 'res', 'next']);
    expect(getArgs(g)).toEqual(['req', 'res', 'next']);
    expect(getArgs(h)).toEqual(['req', 'res', 'next']);
  });
  test('should correctly detect (ctx)', () => {
    const i = (ctx) => {};
    const j = function (ctx) {};
    const k = async (ctx) => {};
    const l = async function (ctx) {};
    const m = async function handler(ctx) {};

    expect(getArgs(i)).toEqual(['ctx']);
    expect(getArgs(j)).toEqual(['ctx']);
    expect(getArgs(k)).toEqual(['ctx']);
    expect(getArgs(l)).toEqual(['ctx']);
    expect(getArgs(m)).toEqual(['ctx']);
  });
});

describe('handlerWrapper ->', () => {
  test('should pass original handler if express like parameters', () => {
    const handler = (req, res) => {};
    const handler2 = function (req, res, next) {};

    expect(handlerWrapper(handler)).toBe(handler);
    expect(handlerWrapper(handler2)).toBe(handler2);
  });
  test('should pass wrapped handler if not express like parameters', () => {
    const handler = (ctx) => {};
    const handler2 = function ({ params }) {};

    expect(handlerWrapper(handler).name).toBe('wrappedHandler');
    expect(handlerWrapper(handler2).name).toBe('wrappedHandler');
  });
});
