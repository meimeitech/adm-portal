<template>
  <div>
    <ul>
      <li v-for="(item, index) in mytabs" v-show="item.selected" :key="index">
         <component :is="myIframe" :src="iframeSrc(item.content)" :refresh="item.refresh" :name="item.name" :index="index"></component>
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
//      isIframe(content) {
// //        debugger;
//        return content.split('path=').length > 0;
//      },
      iframeSrc(content) {
        let src = '';
        content = decodeURIComponent(content.split('path=')[1]);
        if (content.split('?').length > 1) {
          src = content + '&sessionId=' + Cookies.get(mainConst.ADM_SESSION_ID);
        } else {
          src = content + '?sessionId=' + Cookies.get(mainConst.ADM_SESSION_ID);
        }
        return src;
      },
      toPath(path, name) {
        let exists = tabs('exists', name);
        if (exists) {
          this.$store.dispatch('tabInit', tabs('update', {
            tab: name,
            src: path.substring(1, path.length)
          }));
          this.$store.dispatch('tabInit', tabs('select', name));
        } else {
          this.$store.dispatch('tabInit', tabs('add', {
            title: name,
            closeable: true,
            src: path.substring(1, path.length)
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
//        debugger;
//        decodeURIComponent(window.location.hash.split('path=')[1])
        this.toPath(window.location.hash, to.query.name);
      }
    }
  };
</script>

<style>
  .selected{
    display: block;
  }
</style>
