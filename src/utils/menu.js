import { roleMenuList } from './interface';
import {getStore, setStore} from '../utils/storage';
// import Cookies from 'js-cookie';
import * as mainConst from '../utils/const';
let menus = [];
let iteratorInitMenuJsTree = (parent, children, deployUrl) => {
  if (!children) {
    return;
  }
  for (let i = 0; i < children.length; i++) {
    if (children[i].li_attr.resType === '1') {
      continue;
    }
    // 样式
    let icon = '';
    try {
      icon = JSON.parse(children[i].li_attr.style).className;
      // console.log(icon);
    } catch (err) {
      // console.log(children[i].li_attr.name + '样式转换异常！');
    }
    // deployUrl 部署路径
    if (children[i].li_attr.modType === '1') {
      deployUrl = children[i].li_attr.deployUrl;
    }

    let menu = {
      name: children[i].li_attr.name,
      url: children[i].li_attr.path,
      icon: icon,
      deployUrl: deployUrl,
      _id: children[i].li_attr.id
    };
    if (children[i].children.length > 0) {
      menu.children = [];
      iteratorInitMenuJsTree(menu.children, children[i].children, deployUrl);
    }
    parent.push(menu);
  }
};

let getMenuList = async (baseUrl, system) => {
  // console.log(getStore(mainConst.ADM_MENUS + getStore(mainConst.ADM_MENUS_AUTHID) + '-' + system));
  // userInfo.authId
  if (!getStore(mainConst.ADM_MENUS + getStore(mainConst.ADM_MENUS_AUTHID) + '-' + system)) {
    await roleMenuList(baseUrl, {
      system: system
    }).then(r => {
      iteratorInitMenuJsTree(menus, r.body.children, '');
      setStore(mainConst.ADM_MENUS + r.body.text + '-' + system, JSON.stringify(menus));
      setStore(mainConst.ADM_MENUS_AUTHID, r.body.text);
    });
  }
};

let getMenusFromCookies = (funMenus, system) => {
  if (!getStore(mainConst.ADM_MENUS_AUTHID) || !getStore(mainConst.ADM_MENUS + getStore(mainConst.ADM_MENUS_AUTHID) + '-' + system)) {
    setTimeout(() => {
        getMenusFromCookies(funMenus, system);
    }, 500);
  } else {
    funMenus(JSON.parse(getStore(mainConst.ADM_MENUS + getStore(mainConst.ADM_MENUS_AUTHID) + '-' + system)));
  }
};

export {getMenuList, getMenusFromCookies};
