<template>
  <div>
    <ul>
      <li v-for="(item, index) in mytabs" v-show="item.selected" :key="index">
         <component :is="myIframe" :src="item.content.props.src" :refresh="item.content.props.refresh" :index="index"></component>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  /* eslint-disable no-unneeded-ternary */
  import tabs from '../../utils/tabs';
  import iframe from '../iframe/index';
  import Cookies from 'js-cookie';
  import * as mainConst from '../../utils/const';
  export default {
    data() {
      return {
        myIframe: iframe,
        count: 0
      };
    },
    computed: {
      mytabs() {
        return this.$store.state.app.tabs;
      }
    },
    methods: {
      toPath(path, name) {
        let ts = new Date().getTime();
        let src = mainConst.ADM_INDEX1;
        if (path.split('?').length > 1) {
          src = path + '&sessionId=' + Cookies.get(mainConst.ADM_SESSION_ID) + '&ts=' + ts;
        } else {
          src = path + '?sessionId=' + Cookies.get(mainConst.ADM_SESSION_ID) + '&ts=' + ts;
        }
        let exists = tabs('exists', name);
        if (exists) {
          this.$store.dispatch('tabInit', tabs('select', name));
        } else {
          this.$store.dispatch('tabInit', tabs('add', {
            title: name,
            closeable: true,
            component: 'iframe',
            src: src
          }));
        }
        this.moveEvent();
        if (name) {
          document.title = name;
        }
      },
      moveEvent() {
        let self = this;
        setTimeout(() => {
          self.$store.dispatch('tabSelectedIndex', tabs('getSelectedTabIndex'));
        }, 100);
      }
    },
    watch: {
      '$route' (to, from) {
        this.toPath(decodeURIComponent(window.location.hash.split('path=')[1]), to.query.name);
      }
    }
  };
</script>

<style>
  .selected{
    display: block;
  }
</style>
