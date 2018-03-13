import {getStore, setStore} from '../utils/storage';
import * as mainConst from '../utils/const';
import iframe from '../components/iframe';

let defaultTabs = [{
  // type: 'vueRouter',
  title: '首页',
  closeable: false,
  selected: true,
  content: {
    component: iframe, // 组件
    props: {
      src: mainConst.ADM_INDEX
    }
  },
  params: {
    prevLevelName: '首页' // 上级菜单名称
  }
}];

let methods = {
  getTabs: function (tabs) {
    return tabs;
  },
  add: function(tabs, options) { // 添加
    if (!options) return;

    if (this.exists(tabs, options.title)) return tabs;

    let tab = {
      // type: options.type,
      title: options.title, // tab主键
      closeable: options.closeable,
      // fullPath: options.fullPath,
      content: {
        component: options.component, // 组件
        props: {
          src: options.src
        }
      },
      params: {// 其他参数
        prevLevelName: '首页',
        title: options.title
      }
    };
    tabs.push(tab);
    return this.select(tabs, tab);
  },
  close: function(tabs, tab) { // 关闭
    if (tabs.length <= 1) {
      return;
    }
    if (typeof tab === 'string') {
      tab = getTab(tabs, tab);
    }
    if (!this.exists(tabs, tab.title)) return;

    let index = getTabIndex(tabs, tab);
    tabs.splice(index, 1);
    let next;
    if (tab.selected) { // 当前页是删除页
      // 选择最近的tab
      next = tabs.length === index ? tabs[index - 1] : tabs[index];
      // next = tabs[index - 1];
    } else {
      // 选中还是原来页
      next = getSelectedTab(tabs);
    }
    return this.select(tabs, next);
  },
  select: function(tabs, tab) { // 选中
    // 取消选中当前tab
    tabs.forEach(tab => {
      if (tab.selected) {
        tab.selected = false;
      }
    });

    if (typeof tab === 'string') {
      tab = getTab(tabs, tab);
    }
    tab.selected = true;
    let index = getTabIndex(tabs, tab);
    tabs[index] = tab;

    setStore('tabs', JSON.stringify(tabs));
    return tabs;
  },
  exists: function(tabs, which) { // 是否已存在
    return exists(tabs, which);
  },
  update: function(tabs, options) { // 更新
    let tab = options.tab;
    if (typeof tab === 'string') {
      tab = getTab(tabs, tab);
    }

    if (options.src) {
      tab.content.props.src = options.src;
      tab.content.props.refresh = true;
      let index = getTabIndex(tabs, tab);
      tabs[index] = tab;
    } else {
      let ts = new Date();
      if (tab.content.props.src.split('?').length > 1) {
        tab.content.props.src = tab.content.props.src + '&ts=' + ts;
      } else {
        tab.content.props.src = tab.content.props.src + '?ts=' + ts;
      }
      tab.content.props.refresh = true;
      let index = getTabIndex(tabs, tab);
      tabs[index] = tab;
    }
    setStore('tabs', JSON.stringify(tabs));
    return tabs;
  },
  getSelected: function (tabs) {
    return getSelectedTab(tabs);
  },
  getSelectedTabIndex: function (tabs) {
    return getSelectedTabIndex(tabs);
  }
};

// 内部方法
function getTab (tabs, which) {
  let tab = null;
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].title === which) {
      tab = tabs[i];
    }
  }
  return tab;
}

function exists (tabs, which) {
  return getTab(tabs, which) !== null;
}

function getTabs () {
  return getStore('tabs') ? JSON.parse(getStore('tabs')) : defaultTabs;
}

function getTabIndex(tabs, tab) {
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].title === tab.title) {
      return i;
    }
  }
  return -1;
}

function getSelectedTab(tabs) {
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].selected) {
      return tabs[i];
    }
  }
  return null;
}

function getSelectedTabIndex(tabs) {
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].selected) {
      return i;
    }
  }
  return null;
}
export default function(options, param) {
  if (typeof options === 'string') {
    return methods[options](getTabs(), param);
  }
  // 初始化操作
  options = options || {};
};
