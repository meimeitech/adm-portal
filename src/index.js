// 公共布局
import layout from './components/layout';
// 公共工具库
import utils from './utils';
// 公共组件
import {resource, user, role, roleResource, log} from './views/sys';
// import iframe from './components/iframe';
import center from './components/center';
import {index, login, _404} from './views';
// 公共Vuex模块
import app from './store';
let AdmPortal = {
  layout: layout,
  resource: resource,
  user: user,
  role: role,
  roleResource: roleResource,
  log: log,
  center: center,
  index: index,
  login: login,
  _404: _404
};

const install = function (Vue, opts = {}) {
  Object.keys(AdmPortal).forEach(key => {
    Vue.component(key, AdmPortal[key]);
  });
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  layout, resource, user, role, roleResource, log, center, index, login, _404, utils, app
};
