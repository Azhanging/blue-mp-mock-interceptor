const utils = require('blue-utils');

//路由配置信息，会被扩展
const routeOpts = {
  method: 'GET',
  url: ''
};

//小程序request拦截,代码太少就不用babel处理了
class BlueMpMockInterceptor {
  constructor(opts = {
    routes: []
  }) {
    this.options = opts;
    //记录路由
    this.routes = [];
    //记录地址路径
    this.routesMap = [];
    //初始化
    this._init();
  }

  _init() {
    init.call(this);
  }

  //添加路由
  addRoutes(routes = []) {
    addRoutes.call(this, routes);
    return this;
  }

  //查找路由位置
  findRoute(route) {
    return findRoute.call(this, route);
  }

  //响应路由
  response(route = {}) {
    const constructor = this.constructor;
    const response = route.response();
    const { url, method } = route;
    console.log(`%cMock Request \n\nUrl:${url}\n\nMethod:${method}\n\nTime:${new Date()}\n\nresponse:`, constructor.consoleStyle, response);
    //针对小程序的数据流处理
    return {
      cookies: route.cookies || [],
      header: route.header || {},
      statusCode: route.statusCode || 200,
      data: response || {}
    };
  }

}

//模拟数据样式
BlueMpMockInterceptor.consoleStyle = `background-color:#0f8cca;color:white;padding:2px 4px;border-radius:4px;`;

//初始化
function init() {
  const options = this.options;
  //初始化参数路由路径
  this.addRoutes(options.routes || []);
}

//添加路由
function addRoutes(routes) {
  routes.forEach((route) => {
    this.routesMap.push(route.url);
    this.routes.push(utils.extend(routeOpts, route));
  });
}

//查找路由
function findRoute(route = {}) {

  const {
    method = 'GET',
    url = ``
  } = route;

  const routes = this.routes;
  const routesMap = this.routesMap;
  if (url instanceof RegExp) {
    for (let index = 0; index < routesMap.length; index++) {
      const currentRoute = routes[index];
      if (routes.test(url) && (method.toLocaleUpperCase() === currentRoute.method.toLocaleUpperCase())) {
        return currentRoute;
      }
    }
  } else if (typeof url === 'string') {
    const index = routesMap.indexOf(url);
    const currentRoute = routes[index];
    //检查是否在列表中，方法一致
    if (index !== -1 && (method.toLocaleUpperCase() === currentRoute.method.toLocaleUpperCase())) {
      return currentRoute;
    }
  }
  return false;
}

module.exports = BlueMpMockInterceptor;
