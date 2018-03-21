// import Cookies from 'js-cookie';
import {getBaseUrl, getLoginUrl} from '../utils/env';
// import * as mainConst from '../utils/const';
import {getStore, setStore} from '../utils/storage';
// import iView from 'iview';

const app = {
  state: {
    userInfo: {},
    sidebar: {
      opened: !+getStore('sidebarStatus'),
      minOpen: false // 小屏时菜单状态
    },
    lang: {
      icon: '#icon-zhongguo',
      type: 'CN'
    },
    searchState: {
      show: false,
      params: ''
    },
    tabs: [],
    tabSelectedIndex: 0,
    menuTabarWidth: null,
    menuFirsClick: true,
    system: 'meme2c',
    // menuType: 3, // 菜单等级，2-显示某系统菜单  3-显示平台及菜单
    baseUrl: getBaseUrl(process.env.NODE_ENV), // 接口路径
    loginUrl: getLoginUrl(process.env.NODE_ENV) // 登陆页面
  },
  mutations: {
    /**
     * 初始化用户信息
     * @param state
     * @param payload
     * @constructor
     */
    INIT_USER_INFO: (state, payload) => {
      state.userInfo = payload;
    },
    /**
     * 菜单的缩展
     */
    TOGGLE_SIDEBAR: state => {
      let winWidth = document.documentElement.clientWidth;
      if (winWidth <= 600) {
        state.sidebar.minOpen = !state.sidebar.minOpen;
        state.sidebar.opened = false;
        setStore('sidebarStatus', 0);
        return;
      } else {
        if (state.sidebar.opened) {
          setStore('sidebarStatus', 1);
        } else {
          setStore('sidebarStatus', 0);
        }
        state.sidebar.opened = !state.sidebar.opened;
      }
    },
    CLOSE_SLIDEBAR: state => {
      setStore('sidebarStatus', 0);
      state.sidebar.opened = false;
      state.sidebar.minOpen = false;
    },
    OPEN_SLIDEBAR: state => {
      setStore('sidebarStatus', 1);
      state.sidebar.opened = true;
    },
    /**
     * 设置语言
     */
    SET_LANG: (state, payload) => {
      state.lang = payload;
      setStore('lang', payload);
    },
    TAB_INIT: (state, payload) => {
      state.tabs = payload;
    },
    TABS_SELECTED_INDEX: (state, index) => {
      state.tabSelectedIndex = index;
    }
  },
  actions: {
    initUserInfo: ({commit}, payload) => {
      commit('INIT_USER_INFO', payload);
    },
    ToggleSideBar: ({commit}) => {
      commit('TOGGLE_SIDEBAR');
    },
    setLang: ({commit}, payload) => {
      commit('SET_LANG', payload);
    },
    // tabs相关操作
    tabInit: ({commit, state}, payload) => {
      commit('TAB_INIT', payload);
    },
    tabSelectedIndex: ({commit}, index) => {
      commit('TABS_SELECTED_INDEX', index);
    }
  }
};

export default app;
